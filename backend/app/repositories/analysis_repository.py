"""
REPOSITORY — Analyses
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import AnalysisHistory
from .base_repository import BaseRepository


class AnalysisRepository(BaseRepository[AnalysisHistory]):

    def __init__(self, db: Session):
        super().__init__(AnalysisHistory, db)

    def get_user_history(self, user_id: int, limit: int = 50) -> List[AnalysisHistory]:
        return (
            self.db.query(AnalysisHistory)
            .filter_by(user_id=user_id)
            .order_by(AnalysisHistory.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_user_analysis(self, analysis_id: int, user_id: int) -> Optional[AnalysisHistory]:
        return (
            self.db.query(AnalysisHistory)
            .filter(
                AnalysisHistory.id == analysis_id,
                AnalysisHistory.user_id == user_id,
            )
            .first()
        )

    def count_by_user(self, user_id: int) -> int:
        return self.db.query(AnalysisHistory).filter_by(user_id=user_id).count()
