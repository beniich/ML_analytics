"""
Time Series Forecasting Endpoints
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
from io import BytesIO
import logging

from database import get_db
from models import User, AnalysisHistory, AnalysisReport
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/timeseries", tags=["Time Series"])


def _load_df(content: bytes, filename: str) -> pd.DataFrame:
    ext = filename.split(".")[-1].lower()
    if ext == "csv":
        return pd.read_csv(BytesIO(content))
    elif ext in ("xlsx", "xls"):
        return pd.read_excel(BytesIO(content))
    elif ext == "json":
        return pd.read_json(BytesIO(content))
    raise HTTPException(status_code=400, detail=f"Format non supporté: {ext}")


def _simple_moving_avg(series: pd.Series, window: int = 5) -> list:
    return series.rolling(window=window, min_periods=1).mean().tolist()


def _naive_forecast(series: pd.Series, periods: int = 12) -> list:
    """Naive seasonal forecast by repeating last cycle"""
    if len(series) < periods:
        last_val = float(series.iloc[-1]) if len(series) > 0 else 0
        return [last_val] * periods
    last_cycle = series.iloc[-periods:].values
    return [float(v) for v in last_cycle]


@router.post("/analyze")
async def analyze_timeseries(
    file: UploadFile = File(...),
    date_column: str = Query(None),
    value_column: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze time series data — trend, seasonality, statistics"""
    try:
        content = await file.read()
        df = _load_df(content, file.filename)

        # Auto-detect date column
        if not date_column:
            for col in df.columns:
                try:
                    pd.to_datetime(df[col])
                    date_column = col
                    break
                except Exception:
                    pass

        # Auto-detect value column (first numeric)
        if not value_column:
            num_cols = df.select_dtypes(include="number").columns.tolist()
            if num_cols:
                value_column = num_cols[0]

        if not value_column or value_column not in df.columns:
            raise HTTPException(status_code=400, detail="No numeric column found")

        series = df[value_column].dropna()
        sma = _simple_moving_avg(series)
        trend = "upward" if series.iloc[-1] > series.iloc[0] else "downward"

        result = {
            "date_column": date_column,
            "value_column": value_column,
            "length": int(len(series)),
            "mean": round(float(series.mean()), 4),
            "std": round(float(series.std()), 4),
            "min": float(series.min()),
            "max": float(series.max()),
            "trend": trend,
            "moving_average_5": [round(v, 4) for v in sma],
            "raw_values": series.tolist()
        }

        db.add(AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=len(content),
            analysis_type="timeseries_analyze",
            status="completed",
            rows_processed=int(len(series))
        ))
        db.commit()
        return {"status": "success", "analysis": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Timeseries analyze error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/forecast")
async def forecast_timeseries(
    file: UploadFile = File(...),
    value_column: str = Query(None),
    periods: int = Query(12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Forecast future values using naive seasonal model"""
    try:
        content = await file.read()
        df = _load_df(content, file.filename)

        if not value_column:
            num_cols = df.select_dtypes(include="number").columns.tolist()
            if num_cols:
                value_column = num_cols[0]

        if not value_column or value_column not in df.columns:
            raise HTTPException(status_code=400, detail="No valid column found")

        series = df[value_column].dropna()
        forecast = _naive_forecast(series, periods)
        lower_bound = [round(v * 0.9, 4) for v in forecast]
        upper_bound = [round(v * 1.1, 4) for v in forecast]

        result = {
            "value_column": value_column,
            "periods_forecasted": periods,
            "forecast": [round(v, 4) for v in forecast],
            "lower_bound_90": lower_bound,
            "upper_bound_90": upper_bound,
            "model": "naive_seasonal",
            "historical_mean": round(float(series.mean()), 4),
        }

        report = AnalysisReport(
            user_id=current_user.id,
            report_name=f"Forecast - {file.filename}",
            report_type="json",
            report_data=result
        )
        db.add(report)
        db.add(AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=len(content),
            analysis_type="timeseries_forecast",
            status="completed",
            rows_processed=int(len(series))
        ))
        db.commit()
        return {"status": "success", "report_id": report.id, "forecast": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Forecast error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/comprehensive-analysis/{report_id}")
async def get_comprehensive_timeseries(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve a saved timeseries report"""
    report = db.query(AnalysisReport).filter(
        AnalysisReport.id == report_id,
        AnalysisReport.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"report_id": report_id, "data": report.report_data}
