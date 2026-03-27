"""
Main FastAPI application with all API endpoints
"""
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import logging
import os
import traceback
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session

# Import custom modules
from config import (
    API_TITLE, API_VERSION, API_DESCRIPTION, 
    CORS_ORIGINS, UPLOAD_DIRECTORY, REPORTS_DIRECTORY,
    MAX_UPLOAD_SIZE
)
from database import init_db, get_db, engine
from models import Base, User, AnalysisReport, AnalysisHistory, MLModel, ApiKey
from auth import (
    get_current_user, get_current_admin, create_access_token, 
    create_refresh_token, verify_token, generate_test_token
)
from analyzer import DataAnalyzer
from reports import ReportGenerator

# Try to import advanced endpoints (optional, for advanced features)
try:
    from advanced_endpoints import router as advanced_router
    advanced_endpoints_available = True
except ImportError:
    advanced_endpoints_available = False
    logger_placeholder = logging.getLogger(__name__)
    logger_placeholder.warning("Advanced endpoints not available")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    logger.info("Application startup - Database initialized")

# Include advanced endpoints router if available
if advanced_endpoints_available:
    app.include_router(advanced_router)
    logger.info("Advanced endpoints loaded successfully")

# ==================== Authentication Endpoints ====================

@app.post("/api/auth/register", tags=["Authentication"])
async def register(
    username: str,
    email: str,
    password: str,
    full_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )
        
        # Create new user
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            is_active=True
        )
        user.set_password(password)
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        logger.info(f"New user registered: {username}")
        
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "message": "User registered successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in register: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/auth/login", tags=["Authentication"])
async def login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    """User login - returns access and refresh tokens"""
    try:
        # Find user
        user = db.query(User).filter(User.username == username).first()
        
        if not user or not user.verify_password(password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Generate tokens
        access_token = create_access_token(data={"sub": user.username})
        refresh_token = create_refresh_token(data={"sub": user.username})
        
        logger.info(f"User login: {username}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/auth/refresh", tags=["Authentication"])
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        payload = verify_token(refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        new_access_token = create_access_token(data={"sub": username})
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in refresh_token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ==================== Analysis Endpoints ====================

@app.post("/api/analysis/basic", tags=["Analysis"])
async def basic_stats(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run basic statistical analysis on uploaded file"""
    try:
        # Read file
        contents = await file.read()
        df = pd.read_csv(file.file if hasattr(file, 'file') else contents)
        
        # Analyze
        analyzer = DataAnalyzer(df)
        result = analyzer.basic_statistics()
        
        # Log analysis
        analysis_log = AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=len(contents),
            analysis_type="basic_statistics",
            status="completed",
            rows_processed=len(df)
        )
        db.add(analysis_log)
        db.commit()
        
        return {"analysis_type": "basic_statistics", "data": result}
    except Exception as e:
        logger.error(f"Error in basic_stats: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/analysis/correlation", tags=["Analysis"])
async def correlation(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run correlation analysis on numeric columns"""
    try:
        contents = await file.read()
        df = pd.read_csv(file.file if hasattr(file, 'file') else contents)
        
        analyzer = DataAnalyzer(df)
        result = analyzer.correlation_analysis()
        
        analysis_log = AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            analysis_type="correlation",
            status="completed",
            rows_processed=len(df)
        )
        db.add(analysis_log)
        db.commit()
        
        return {"analysis_type": "correlation", "data": result}
    except Exception as e:
        logger.error(f"Error in correlation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/analysis/distribution", tags=["Analysis"])
async def distribution(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze distribution of numeric columns"""
    try:
        contents = await file.read()
        df = pd.read_csv(file.file if hasattr(file, 'file') else contents)
        
        analyzer = DataAnalyzer(df)
        result = analyzer.distribution_analysis()
        
        analysis_log = AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            analysis_type="distribution",
            status="completed",
            rows_processed=len(df)
        )
        db.add(analysis_log)
        db.commit()
        
        return {"analysis_type": "distribution", "data": result}
    except Exception as e:
        logger.error(f"Error in distribution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/analysis/predictive", tags=["Analysis"])
async def predictive(
    file: UploadFile = File(...),
    target_column: Optional[str] = Query(None),
    model_type: str = Query("regression"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Train predictive model on data"""
    try:
        contents = await file.read()
        df = pd.read_csv(file.file if hasattr(file, 'file') else contents)
        
        analyzer = DataAnalyzer(df)
        result = analyzer.predictive_modeling(target_column, model_type)
        
        analysis_log = AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            analysis_type="predictive_modeling",
            status="completed",
            rows_processed=len(df)
        )
        db.add(analysis_log)
        db.commit()
        
        return {"analysis_type": "predictive_modeling", "data": result}
    except Exception as e:
        logger.error(f"Error in predictive: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/analysis/outliers", tags=["Analysis"])
async def outliers(
    file: UploadFile = File(...),
    method: str = Query("iqr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Detect outliers in data"""
    try:
        contents = await file.read()
        df = pd.read_csv(file.file if hasattr(file, 'file') else contents)
        
        analyzer = DataAnalyzer(df)
        result = analyzer.outlier_detection(method)
        
        analysis_log = AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            analysis_type="outlier_detection",
            status="completed",
            rows_processed=len(df)
        )
        db.add(analysis_log)
        db.commit()
        
        return {"analysis_type": "outlier_detection", "data": result}
    except Exception as e:
        logger.error(f"Error in outliers: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/analysis/complete", tags=["Analysis"])
async def complete_analysis(
    file: UploadFile = File(...),
    report_format: str = Query("html"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run complete analysis suite and generate report"""
    try:
        contents = await file.read()
        df = pd.read_csv(file.file if hasattr(file, 'file') else contents)
        
        # Run analysis
        analyzer = DataAnalyzer(df)
        analysis_results = analyzer.complete_analysis()
        
        # Generate report
        report_generator = ReportGenerator(
            title=f"Analysis Report - {file.filename}",
            user=current_user.username
        )
        
        # Save report
        os.makedirs(REPORTS_DIRECTORY, exist_ok=True)
        report_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename.split('.')[0]}"
        
        if report_format == "html":
            report_path = f"{REPORTS_DIRECTORY}/{report_filename}.html"
            report_generator.save_html_report(analysis_results, report_path)
        else:
            report_path = f"{REPORTS_DIRECTORY}/{report_filename}.json"
            report_generator.save_json_report(analysis_results, report_path)
        
        # Save to database
        report_record = AnalysisReport(
            user_id=current_user.id,
            report_name=report_filename,
            report_type=report_format,
            report_data=analysis_results,
            file_path=report_path,
            description=f"Complete analysis of {file.filename}"
        )
        db.add(report_record)
        
        analysis_log = AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            analysis_type="complete_analysis",
            status="completed",
            rows_processed=len(df)
        )
        db.add(analysis_log)
        db.commit()
        
        return {
            "analysis_type": "complete_analysis",
            "report_id": report_record.id,
            "report_path": report_path,
            "data": analysis_results
        }
    except Exception as e:
        logger.error(f"Error in complete_analysis: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== Report Management Endpoints ====================

@app.get("/api/reports", tags=["Reports"])
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(10)
):
    """List all reports for the current user"""
    try:
        reports = db.query(AnalysisReport).filter(
            AnalysisReport.user_id == current_user.id
        ).offset(skip).limit(limit).all()
        
        return {
            "total": db.query(AnalysisReport).filter(
                AnalysisReport.user_id == current_user.id
            ).count(),
            "reports": [
                {
                    "id": r.id,
                    "name": r.report_name,
                    "type": r.report_type,
                    "created_at": r.created_at.isoformat(),
                    "description": r.description
                }
                for r in reports
            ]
        }
    except Exception as e:
        logger.error(f"Error in list_reports: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/reports/{report_id}", tags=["Reports"])
async def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve a specific report"""
    try:
        report = db.query(AnalysisReport).filter(
            (AnalysisReport.id == report_id) & 
            (AnalysisReport.user_id == current_user.id)
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        return {
            "id": report.id,
            "name": report.report_name,
            "type": report.report_type,
            "created_at": report.created_at.isoformat(),
            "data": report.report_data
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.delete("/api/reports/{report_id}", tags=["Reports"])
async def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a report"""
    try:
        report = db.query(AnalysisReport).filter(
            (AnalysisReport.id == report_id) & 
            (AnalysisReport.user_id == current_user.id)
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Delete file if exists
        if report.file_path and os.path.exists(report.file_path):
            os.remove(report.file_path)
        
        db.delete(report)
        db.commit()
        
        return {"message": "Report deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in delete_report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ==================== User Management Endpoints ====================

@app.get("/api/users/me", tags=["Users"])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_admin": current_user.is_admin,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat(),
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None
    }


@app.put("/api/users/me", tags=["Users"])
async def update_user_profile(
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        if full_name:
            current_user.full_name = full_name
        if email:
            # Check if email is unique
            existing = db.query(User).filter(
                (User.email == email) & (User.id != current_user.id)
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            current_user.email = email
        
        db.commit()
        db.refresh(current_user)
        
        return {"message": "Profile updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in update_user_profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ==================== Health & Info Endpoints ====================

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Check API health status"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": API_VERSION
    }


@app.get("/api/info", tags=["Info"])
async def api_info():
    """Get API information"""
    return {
        "title": API_TITLE,
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "endpoints": {
            "authentication": ["/api/auth/register", "/api/auth/login", "/api/auth/refresh"],
            "analysis": ["/api/analysis/basic", "/api/analysis/correlation", "/api/analysis/distribution", "/api/analysis/predictive", "/api/analysis/complete"],
            "reports": ["/api/reports", "/api/reports/{report_id}"],
            "users": ["/api/users/me"]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
