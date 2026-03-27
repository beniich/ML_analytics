"""
Feature Engineering Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Any, Dict, List, Optional
import pandas as pd
import numpy as np
import logging

from models import User
from auth import get_current_user
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/engineering", tags=["Feature Engineering"])


class ComputeRequest(BaseModel):
    data: List[Dict[str, Any]]
    features: List[Dict[str, Any]]  # [{name, expression, type}]


@router.post("/compute")
async def compute_features(
    req: ComputeRequest,
    current_user: User = Depends(get_current_user)
):
    """Compute new features from existing columns"""
    try:
        df = pd.DataFrame(req.data)
        results = []

        for feature in req.features:
            name = feature.get("name", "new_feature")
            expr = feature.get("expression", "")
            feat_type = feature.get("type", "formula")

            try:
                if feat_type == "formula":
                    df[name] = df.eval(expr)
                    results.append({"feature": name, "status": "computed", "sample": df[name].head(5).tolist()})
                elif feat_type == "log":
                    col = feature.get("column")
                    df[name] = np.log1p(df[col].clip(lower=0))
                    results.append({"feature": name, "status": "computed", "sample": df[name].head(5).tolist()})
                elif feat_type == "lag":
                    col = feature.get("column")
                    lag = feature.get("lag", 1)
                    df[name] = df[col].shift(lag)
                    results.append({"feature": name, "status": "computed", "sample": df[name].head(5).tolist()})
                elif feat_type == "rolling_mean":
                    col = feature.get("column")
                    window = feature.get("window", 3)
                    df[name] = df[col].rolling(window=window, min_periods=1).mean()
                    results.append({"feature": name, "status": "computed", "sample": df[name].head(5).tolist()})
                else:
                    results.append({"feature": name, "status": "skipped", "reason": "unknown type"})
            except Exception as fe:
                results.append({"feature": name, "status": "error", "reason": str(fe)})

        return {
            "features_processed": len(req.features),
            "results": results,
            "columns": df.columns.tolist(),
            "data": df.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/stats/{column}")
async def get_column_stats(
    column: str,
    current_user: User = Depends(get_current_user)
):
    """Get statistical information about a column (stub - real data required POST)"""
    return {
        "column": column,
        "message": "Submit data via POST /engineering/compute to compute stats",
        "available_transforms": ["log", "lag", "rolling_mean", "formula"]
    }


@router.get("/nodes")
async def list_feature_nodes(
    current_user: User = Depends(get_current_user)
):
    """Return available feature engineering node types"""
    return {
        "nodes": [
            {"type": "formula", "label": "Custom Formula", "description": "Pandas eval expression", "example": "col_a * col_b"},
            {"type": "log", "label": "Log Transform", "description": "Natural log (log1p)", "params": ["column"]},
            {"type": "lag", "label": "Lag Feature", "description": "Shift column by N rows", "params": ["column", "lag"]},
            {"type": "rolling_mean", "label": "Rolling Mean", "description": "Moving average", "params": ["column", "window"]},
        ]
    }
