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
