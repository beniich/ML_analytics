import logging
import os
import traceback
from datetime import datetime
from io import BytesIO
from typing import Optional

import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from config import REPORTS_DIRECTORY
from database import get_db
from models import AnalysisHistory, AnalysisReport, User
from routers.auth_router import get_current_user
from services.analyzer import DataAnalyzer
from services.reports import ReportGenerator
from pydantic import BaseModel

class TrainRequest(BaseModel):
    algorithm: str
    target_column: Optional[str] = "target"
    problem_type: Optional[str] = "classification"

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

def _load_df(content: bytes, filename: str) -> pd.DataFrame:
    ext = filename.split(".")[-1].lower()
    if ext == "csv":
        return pd.read_csv(BytesIO(content))
    elif ext in ("xlsx", "xls"):
        return pd.read_excel(BytesIO(content))
    elif ext == "json":
        return pd.read_json(BytesIO(content))
    raise HTTPException(status_code=400, detail=f"Unsupported format: {ext}")

@router.post("/basic")
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

@router.post("/correlation")
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

@router.post("/distribution")
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

@router.post("/predictive")
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

@router.post("/outliers")
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

@router.post("/complete")
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

@router.post("/train-model")
async def train_mocked_live_dataset(
    req: TrainRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Train a model on a synthetic dataset to demonstrate active Scikit-Learn training.
    The UI calls this instead of uploading a file.
    """
    try:
        from sklearn.datasets import make_classification, make_regression
        from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
        from sklearn.linear_model import LogisticRegression, LinearRegression
        from sklearn.svm import SVC, SVR
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, precision_score, recall_score, mean_squared_error, r2_score
        import numpy as np
        
        # 1. Generate appropriate dataset
        if req.problem_type == "classification":
            X, y = make_classification(n_samples=1000, n_features=20, n_informative=15, random_state=42)
        else:
            X, y = make_regression(n_samples=1000, n_features=20, n_informative=15, random_state=42)
            
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 2. Select Algorithm
        algo = req.algorithm.lower()
        if req.problem_type == "classification":
            if "random forest" in algo:
                model = RandomForestClassifier(n_estimators=50, random_state=42)
            elif "svm" in algo or "support vector" in algo:
                model = SVC(kernel="rbf")
            else:
                model = LogisticRegression()
        else:
            if "random forest" in algo:
                model = RandomForestRegressor(n_estimators=50, random_state=42)
            elif "svm" in algo or "support vector" in algo:
                model = SVR(kernel="rbf")
            else:
                model = LinearRegression()

        # 3. Train
        start = datetime.now()
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        duration_ms = int((datetime.now() - start).total_seconds() * 1000)

        # 4. Metrics
        if req.problem_type == "classification":
            metrics = {
                "accuracy": float(accuracy_score(y_test, y_pred)),
                "precision": float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
                "recall": float(recall_score(y_test, y_pred, average='weighted', zero_division=0))
            }
        else:
            mse = float(mean_squared_error(y_test, y_pred))
            metrics = {
                "mse": mse,
                "rmse": float(np.sqrt(mse)),
                "r2_score": float(r2_score(y_test, y_pred))
            }

        return {
            "status": "success",
            "algorithm_used": str(type(model).__name__),
            "metrics": metrics,
            "training_time_ms": duration_ms,
            "samples": len(X)
        }
    except Exception as e:
        logger.error(f"Error training model: {e}")
        raise HTTPException(status_code=500, detail=str(e))

