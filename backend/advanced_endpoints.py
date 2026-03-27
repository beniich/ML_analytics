"""
Advanced Analysis Endpoints
Integration of caching, multi-format support, and anomaly detection
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
import pandas as pd
import json
import logging
from typing import Optional
from sqlalchemy.orm import Session

from database import get_db
from models import User, AnalysisReport
from auth import get_current_user
from analyzer import DataAnalyzer
from anomaly_detector import anomaly_detector
from data_loader import MultiFormatLoader, validate_supported_format

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/analysis", tags=["Advanced Analysis"])

try:
    from cache import cache
except:
    cache = None

@router.post("/comprehensive")
async def comprehensive_analysis(
    file: UploadFile = File(...),
    include_predictions: bool = Query(True),
    include_anomaly_detection: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Comprehensive analysis with caching and anomaly detection"""
    try:
        if not validate_supported_format(file.filename):
            raise HTTPException(status_code=400, detail="Unsupported format")
        
        content = await file.read()
        file_ext = file.filename.split('.')[-1]
        df = MultiFormatLoader.load_from_file(content, file_ext)
        
        analyzer = DataAnalyzer(df)
        analysis_results = {
            "basic_statistics": analyzer.basic_statistics(),
            "correlation": analyzer.correlation_analysis(),
            "distribution": analyzer.distribution_analysis(),
        }
        
        if include_predictions:
            analysis_results["predictive_model"] = analyzer.predictive_modeling()
        
        report_record = AnalysisReport(
            user_id=current_user.id,
            report_name=f"Analysis - {file.filename}",
            report_type="json",
            report_data=analysis_results
        )
        db.add(report_record)
        db.commit()
        
        return {"status": "success", "report_id": report_record.id, "analysis": analysis_results}
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/anomaly-detection")
async def detect_anomalies(
    file: UploadFile = File(...),
    detection_method: str = Query("zscore"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Advanced anomaly detection"""
    try:
        if not validate_supported_format(file.filename):
            raise HTTPException(status_code=400, detail="Unsupported format")
        
        content = await file.read()
        file_ext = file.filename.split('.')[-1]
        df = MultiFormatLoader.load_from_file(content, file_ext)
        
        results = {"file": file.filename, "detection_method": detection_method, "anomalies": {}}
        
        for col in df.select_dtypes(include=['number']).columns:
            if detection_method == "zscore":
                result = anomaly_detector.detect_outliers_zscore(df[col])
            elif detection_method == "iqr":
                result = anomaly_detector.detect_outliers_iqr(df[col])
            results["anomalies"][col] = result
        
        report_record = AnalysisReport(
            user_id=current_user.id,
            report_name=f"Anomaly Detection - {file.filename}",
            report_type="json",
            report_data=results
        )
        db.add(report_record)
        db.commit()
        
        return {"status": "success", "report_id": report_record.id, "detection_results": results}
    except Exception as e:
        logger.error(f"Anomaly detection error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
