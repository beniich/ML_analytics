"""
SERVICE — Analyses de données
Logique métier : chargement, validation, analyse, sauvegarde
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..'))

import logging
import time
import io
from typing import Any, Dict, Optional

import pandas as pd
from sqlalchemy.orm import Session

from app.models import AnalysisHistory
from app.utils.exceptions import ValidationException, NotFoundException

logger = logging.getLogger(__name__)

ALLOWED_EXT = {".csv", ".xlsx", ".json", ".parquet"}
MAX_SIZE    = 50 * 1024 * 1024  # 50 MB


class AnalysisService:
    """Gère le chargement, la validation et l'analyse des fichiers de données."""

    def __init__(self, db: Session):
        self.db = db

    # ── Validation ─────────────────────────────────────────────────────────
    def validate_file(self, filename: str, size: int) -> None:
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXT:
            raise ValidationException(f"Extension non supportée : {ext}")
        if size > MAX_SIZE:
            raise ValidationException("Fichier trop volumineux (max 50 MB)")

    # ── Chargement ─────────────────────────────────────────────────────────
    async def load_file(self, file) -> pd.DataFrame:
        content  = await file.read()
        filename = file.filename
        ext      = os.path.splitext(filename)[1].lower()

        try:
            if ext == ".csv":
                return pd.read_csv(io.BytesIO(content))
            elif ext == ".xlsx":
                return pd.read_excel(io.BytesIO(content))
            elif ext == ".json":
                return pd.read_json(io.BytesIO(content))
            elif ext == ".parquet":
                return pd.read_parquet(io.BytesIO(content))
        except Exception as e:
            raise ValidationException(f"Erreur lecture fichier : {e}")

        raise ValidationException("Format non géré")

    # ── Analyse basique ────────────────────────────────────────────────────
    def analyze_basic(self, df: pd.DataFrame) -> Dict[str, Any]:
        desc = df.describe(include="all").fillna("N/A").to_dict()
        return {
            "shape":          list(df.shape),
            "columns":        df.columns.tolist(),
            "dtypes":         {k: str(v) for k, v in df.dtypes.items()},
            "missing_values": df.isnull().sum().to_dict(),
            "describe":       desc,
            "duplicates":     int(df.duplicated().sum()),
            "memory_usage_mb": round(df.memory_usage(deep=True).sum() / 1e6, 2),
        }

    # ── Analyse complète ───────────────────────────────────────────────────
    def analyze_comprehensive(self, df: pd.DataFrame) -> Dict[str, Any]:
        basic  = self.analyze_basic(df)
        numeric_df = df.select_dtypes(include="number")

        correlations = {}
        if not numeric_df.empty:
            correlations = numeric_df.corr().fillna(0).to_dict()

        return {
            **basic,
            "correlations": correlations,
            "skewness":     numeric_df.skew().to_dict() if not numeric_df.empty else {},
            "kurtosis":     numeric_df.kurtosis().to_dict() if not numeric_df.empty else {},
        }

    # ── Sauvegarde ─────────────────────────────────────────────────────────
    def save_history(
        self,
        user_id: int,
        file_name: str,
        file_size: int,
        analysis_type: str,
        results: Dict[str, Any],
        execution_time: float,
        rows_processed: int,
        status: str = "completed",
        error_message: Optional[str] = None,
    ) -> AnalysisHistory:
        record = AnalysisHistory(
            user_id        = user_id,
            file_name      = file_name,
            file_size      = file_size,
            analysis_type  = analysis_type,
            results        = results,
            execution_time = execution_time,
            rows_processed = rows_processed,
            status         = status,
            error_message  = error_message,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        logger.info(f"✅ Analyse sauvegardée : id={record.id}")
        return record

    # ── Récupération ───────────────────────────────────────────────────────
    def get_analysis(self, analysis_id: int, user_id: int) -> AnalysisHistory:
        record = (
            self.db.query(AnalysisHistory)
            .filter(AnalysisHistory.id == analysis_id, AnalysisHistory.user_id == user_id)
            .first()
        )
        if not record:
            raise NotFoundException("Analyse introuvable")
        return record

    def get_user_history(self, user_id: int, limit: int = 50) -> list:
        return (
            self.db.query(AnalysisHistory)
            .filter(AnalysisHistory.user_id == user_id)
            .order_by(AnalysisHistory.created_at.desc())
            .limit(limit)
            .all()
        )
