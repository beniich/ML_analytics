"""
ETL / Data Transformation Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, Dict, List, Optional
import pandas as pd
import numpy as np
import logging

from database import get_db
from models import User, AnalysisHistory
from auth import get_current_user
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/transform", tags=["Data Transformation"])


class FilterRequest(BaseModel):
    data: List[Dict[str, Any]]
    column: str
    operator: str  # eq, ne, gt, lt, gte, lte, contains
    value: Any


class AggregateRequest(BaseModel):
    data: List[Dict[str, Any]]
    group_by: List[str]
    agg_column: str
    agg_func: str  # sum, mean, count, min, max


class NormalizeRequest(BaseModel):
    data: List[Dict[str, Any]]
    columns: List[str]
    method: str = "minmax"  # minmax | zscore


class PipelineRequest(BaseModel):
    data: List[Dict[str, Any]]
    steps: List[Dict[str, Any]]


@router.post("/filter")
async def filter_data(
    req: FilterRequest,
    current_user: User = Depends(get_current_user)
):
    """Filter dataset rows by condition"""
    try:
        df = pd.DataFrame(req.data)
        col = req.column
        val = req.value
        op = req.operator

        if op == "eq":
            result = df[df[col] == val]
        elif op == "ne":
            result = df[df[col] != val]
        elif op == "gt":
            result = df[df[col] > val]
        elif op == "lt":
            result = df[df[col] < val]
        elif op == "gte":
            result = df[df[col] >= val]
        elif op == "lte":
            result = df[df[col] <= val]
        elif op == "contains":
            result = df[df[col].astype(str).str.contains(str(val), case=False, na=False)]
        else:
            raise HTTPException(status_code=400, detail=f"Unknown operator: {op}")

        return {
            "filtered_count": len(result),
            "original_count": len(df),
            "data": result.to_dict(orient="records")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/aggregate")
async def aggregate_data(
    req: AggregateRequest,
    current_user: User = Depends(get_current_user)
):
    """Aggregate data by group"""
    try:
        df = pd.DataFrame(req.data)
        agg_map = {"sum": "sum", "mean": "mean", "count": "count", "min": "min", "max": "max"}
        if req.agg_func not in agg_map:
            raise HTTPException(status_code=400, detail=f"Unknown agg_func: {req.agg_func}")

        result = df.groupby(req.group_by)[req.agg_column].agg(agg_map[req.agg_func]).reset_index()
        return {
            "group_by": req.group_by,
            "agg_column": req.agg_column,
            "agg_func": req.agg_func,
            "data": result.to_dict(orient="records")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/normalize")
async def normalize_data(
    req: NormalizeRequest,
    current_user: User = Depends(get_current_user)
):
    """Normalize numeric columns"""
    try:
        df = pd.DataFrame(req.data)
        result = df.copy()
        stats = {}

        for col in req.columns:
            if col not in df.columns:
                continue
            if req.method == "minmax":
                mn, mx = df[col].min(), df[col].max()
                result[col] = (df[col] - mn) / (mx - mn) if mx != mn else 0
                stats[col] = {"min": float(mn), "max": float(mx), "method": "minmax"}
            elif req.method == "zscore":
                mean, std = df[col].mean(), df[col].std()
                result[col] = (df[col] - mean) / std if std != 0 else 0
                stats[col] = {"mean": float(mean), "std": float(std), "method": "zscore"}

        return {
            "method": req.method,
            "columns_normalized": req.columns,
            "stats": stats,
            "data": result.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/pipeline")
async def run_pipeline(
    req: PipelineRequest,
    current_user: User = Depends(get_current_user)
):
    """Run a sequence of transformation steps"""
    try:
        df = pd.DataFrame(req.data)
        log = []

        for step in req.steps:
            step_type = step.get("type")
            before = len(df)

            if step_type == "drop_nulls":
                df = df.dropna(subset=step.get("columns", df.columns.tolist()))
                log.append({"step": "drop_nulls", "rows_before": before, "rows_after": len(df)})

            elif step_type == "rename":
                df = df.rename(columns=step.get("mapping", {}))
                log.append({"step": "rename", "mapping": step.get("mapping", {})})

            elif step_type == "drop_columns":
                cols = [c for c in step.get("columns", []) if c in df.columns]
                df = df.drop(columns=cols)
                log.append({"step": "drop_columns", "dropped": cols})

            elif step_type == "fill_na":
                df = df.fillna(step.get("value", 0))
                log.append({"step": "fill_na", "value": step.get("value", 0)})

            elif step_type == "sort":
                df = df.sort_values(by=step.get("by", []), ascending=step.get("ascending", True))
                log.append({"step": "sort", "by": step.get("by")})

            else:
                log.append({"step": step_type, "status": "skipped (unknown)"})

        return {
            "steps_executed": len(req.steps),
            "pipeline_log": log,
            "output_shape": {"rows": len(df), "cols": len(df.columns)},
            "data": df.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
