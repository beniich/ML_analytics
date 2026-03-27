"""
Data Quality Endpoints - Validation & Profiling
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import json
import logging
from io import BytesIO

from database import get_db
from models import User, AnalysisHistory
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/quality", tags=["Data Quality"])


def _load_df(content: bytes, filename: str) -> pd.DataFrame:
    ext = filename.split(".")[-1].lower()
    if ext == "csv":
        return pd.read_csv(BytesIO(content))
    elif ext in ("xlsx", "xls"):
        return pd.read_excel(BytesIO(content))
    elif ext == "json":
        return pd.read_json(BytesIO(content))
    raise HTTPException(status_code=400, detail=f"Format non supporté: {ext}")


@router.post("/validate")
async def validate_data(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Validate data quality — missing values, types, duplicates"""
    try:
        content = await file.read()
        df = _load_df(content, file.filename)

        total_cells = df.shape[0] * df.shape[1]
        missing_per_col = df.isnull().sum().to_dict()
        total_missing = int(df.isnull().sum().sum())

        result = {
            "file": file.filename,
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "total_cells": int(total_cells),
            "missing_values": {k: int(v) for k, v in missing_per_col.items()},
            "total_missing": total_missing,
            "completeness_pct": round((1 - total_missing / total_cells) * 100, 2) if total_cells else 100,
            "duplicate_rows": int(df.duplicated().sum()),
            "column_types": {col: str(df[col].dtype) for col in df.columns},
            "quality_score": max(0, round(100 - (total_missing / total_cells * 50) - (df.duplicated().sum() / len(df) * 50), 2)) if len(df) else 0
        }

        db.add(AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=len(content),
            analysis_type="quality_validation",
            status="completed",
            rows_processed=int(df.shape[0])
        ))
        db.commit()
        return {"status": "success", "validation": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/profile")
async def profile_data(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a complete data profile"""
    try:
        content = await file.read()
        df = _load_df(content, file.filename)

        profile = {}
        for col in df.columns:
            col_data = df[col]
            info = {
                "dtype": str(col_data.dtype),
                "missing": int(col_data.isnull().sum()),
                "missing_pct": round(col_data.isnull().mean() * 100, 2),
                "unique": int(col_data.nunique()),
                "top_values": col_data.value_counts().head(5).to_dict()
            }
            if pd.api.types.is_numeric_dtype(col_data):
                desc = col_data.describe()
                info.update({
                    "mean": round(float(desc["mean"]), 4) if "mean" in desc else None,
                    "std": round(float(desc["std"]), 4) if "std" in desc else None,
                    "min": float(desc["min"]) if "min" in desc else None,
                    "max": float(desc["max"]) if "max" in desc else None,
                    "median": float(col_data.median()),
                    "skewness": round(float(col_data.skew()), 4),
                    "kurtosis": round(float(col_data.kurtosis()), 4),
                })
            profile[col] = info

        db.add(AnalysisHistory(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=len(content),
            analysis_type="quality_profiling",
            status="completed",
            rows_processed=int(df.shape[0])
        ))
        db.commit()
        return {"status": "success", "profile": profile, "shape": {"rows": df.shape[0], "cols": df.shape[1]}}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profiling error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
