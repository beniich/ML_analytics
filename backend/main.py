"""
ML Analytics API - Main Application
Harmonized FastAPI backend with all modules
"""
import logging
import os
import traceback
from datetime import datetime
from io import BytesIO
from typing import Optional

import pandas as pd
from fastapi import (Depends, FastAPI, File, HTTPException, Query,
                     UploadFile, status)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

# Core modules
from config import (API_DESCRIPTION, API_TITLE, API_VERSION, CORS_ORIGINS,
                    MAX_UPLOAD_SIZE, REPORTS_DIRECTORY, UPLOAD_DIRECTORY)
from database import engine, get_db, init_db
from models import (AnalysisHistory, AnalysisReport, ApiKey, Base, MLModel,
                    User)
from routers.auth_router import get_current_admin, get_current_user
from analyzer import DataAnalyzer
from reports import ReportGenerator

# All new routers
from routers.auth_router import router as auth_router
from routers import (
    billing_router,
    engineering_router,
    jobs_router,
    monitoring_router,
    quality_router,
    support_router,
    timeseries_router,
    transform_router,
)

# Optional: advanced endpoints
try:
    from advanced_endpoints import router as advanced_router
    _advanced_available = True
except ImportError:
    _advanced_available = False

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ── App --------------------------------------------------------------------
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup ----------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    init_db()
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    os.makedirs(REPORTS_DIRECTORY, exist_ok=True)
    logger.info("✅ Application started — DB initialized")


# ── Include all routers -------------------------------------------------------
app.include_router(auth_router)
app.include_router(quality_router)
app.include_router(jobs_router)
app.include_router(transform_router)
app.include_router(timeseries_router)
app.include_router(engineering_router)
app.include_router(monitoring_router)
app.include_router(billing_router)
app.include_router(support_router)

if _advanced_available:
    app.include_router(advanced_router)
    logger.info("✅ Advanced endpoints loaded")


# ── Helper -----------------------------------------------------------------
def _load_df(content: bytes, filename: str) -> pd.DataFrame:
    ext = filename.split(".")[-1].lower()
    if ext == "csv":
        return pd.read_csv(BytesIO(content))
    elif ext in ("xlsx", "xls"):
        return pd.read_excel(BytesIO(content))
    elif ext == "json":
        return pd.read_json(BytesIO(content))
    raise HTTPException(status_code=400, detail=f"Unsupported format: {ext}")


# ── ANALYSIS ---------------------------------------------------------------

@app.post("/api/analysis/basic", tags=["Analysis"])
async def basic_stats(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        df = _load_df(content, file.filename)
        result = DataAnalyzer(df).basic_statistics()
        db.add(AnalysisHistory(user_id=current_user.id, file_name=file.filename, file_size=len(content),
                                analysis_type="basic_statistics", status="completed", rows_processed=len(df)))
        db.commit()
        return {"analysis_type": "basic_statistics", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analysis/correlation", tags=["Analysis"])
async def correlation(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        df = _load_df(content, file.filename)
        result = DataAnalyzer(df).correlation_analysis()
        db.add(AnalysisHistory(user_id=current_user.id, file_name=file.filename,
                                analysis_type="correlation", status="completed", rows_processed=len(df)))
        db.commit()
        return {"analysis_type": "correlation", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analysis/distribution", tags=["Analysis"])
async def distribution(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        df = _load_df(content, file.filename)
        result = DataAnalyzer(df).distribution_analysis()
        db.add(AnalysisHistory(user_id=current_user.id, file_name=file.filename,
                                analysis_type="distribution", status="completed", rows_processed=len(df)))
        db.commit()
        return {"analysis_type": "distribution", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analysis/predictive", tags=["Analysis"])
async def predictive(
    file: UploadFile = File(...),
    target_column: Optional[str] = Query(None),
    model_type: str = Query("regression"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        df = _load_df(content, file.filename)
        result = DataAnalyzer(df).predictive_modeling(target_column, model_type)
        db.add(AnalysisHistory(user_id=current_user.id, file_name=file.filename,
                                analysis_type="predictive_modeling", status="completed", rows_processed=len(df)))
        db.commit()
        return {"analysis_type": "predictive_modeling", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analysis/outliers", tags=["Analysis"])
async def outliers(
    file: UploadFile = File(...),
    method: str = Query("iqr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        df = _load_df(content, file.filename)
        result = DataAnalyzer(df).outlier_detection(method)
        db.add(AnalysisHistory(user_id=current_user.id, file_name=file.filename,
                                analysis_type="outlier_detection", status="completed", rows_processed=len(df)))
        db.commit()
        return {"analysis_type": "outlier_detection", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analysis/complete", tags=["Analysis"])
async def complete_analysis(
    file: UploadFile = File(...),
    report_format: str = Query("html"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        df = _load_df(content, file.filename)
        analyzer = DataAnalyzer(df)
        analysis_results = analyzer.complete_analysis()

        rg = ReportGenerator(title=f"Analysis Report - {file.filename}", user=current_user.username)
        os.makedirs(REPORTS_DIRECTORY, exist_ok=True)
        report_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename.split('.')[0]}"

        if report_format == "html":
            report_path = f"{REPORTS_DIRECTORY}/{report_filename}.html"
            rg.save_html_report(analysis_results, report_path)
        else:
            report_path = f"{REPORTS_DIRECTORY}/{report_filename}.json"
            rg.save_json_report(analysis_results, report_path)

        report_record = AnalysisReport(
            user_id=current_user.id,
            report_name=report_filename,
            report_type=report_format,
            report_data=analysis_results,
            file_path=report_path,
            description=f"Complete analysis of {file.filename}",
        )
        db.add(report_record)
        db.add(AnalysisHistory(user_id=current_user.id, file_name=file.filename,
                                analysis_type="complete_analysis", status="completed", rows_processed=len(df)))
        db.commit()
        return {"analysis_type": "complete_analysis", "report_id": report_record.id, "report_path": report_path, "data": analysis_results}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))


# ── REPORTS ----------------------------------------------------------------

@app.get("/api/reports", tags=["Reports"])
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(10),
):
    reports = db.query(AnalysisReport).filter(AnalysisReport.user_id == current_user.id).offset(skip).limit(limit).all()
    total = db.query(AnalysisReport).filter(AnalysisReport.user_id == current_user.id).count()
    return {
        "total": total,
        "reports": [
            {"id": r.id, "name": r.report_name, "type": r.report_type,
             "created_at": r.created_at.isoformat(), "description": r.description}
            for r in reports
        ],
    }


@app.get("/api/reports/{report_id}", tags=["Reports"])
async def get_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).filter(
        AnalysisReport.id == report_id, AnalysisReport.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"id": report.id, "name": report.report_name, "type": report.report_type,
            "created_at": report.created_at.isoformat(), "data": report.report_data}


@app.delete("/api/reports/{report_id}", tags=["Reports"])
async def delete_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).filter(
        AnalysisReport.id == report_id, AnalysisReport.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if report.file_path and os.path.exists(report.file_path):
        os.remove(report.file_path)
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}


# ── USERS ------------------------------------------------------------------

@app.get("/api/users/me", tags=["Users"])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_admin": current_user.is_admin,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat(),
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
    }


@app.put("/api/users/me", tags=["Users"])
async def update_user_profile(
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if full_name:
            current_user.full_name = full_name
        if email:
            existing = db.query(User).filter(User.email == email, User.id != current_user.id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")
            current_user.email = email
        db.commit()
        db.refresh(current_user)
        return {"message": "Profile updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── HEALTH & INFO ----------------------------------------------------------

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "version": API_VERSION}


@app.get("/api/info", tags=["Info"])
async def api_info():
    return {
        "title": API_TITLE,
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "modules": [
            "authentication", "analysis", "data_quality", "job_scheduler",
            "data_transformation", "time_series", "feature_engineering",
            "monitoring", "billing", "support", "reports", "users"
        ],
        "endpoints_count": len([r for r in app.routes]),
    }


# ── Entry point  -----------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
