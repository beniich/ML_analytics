"""
CONTROLLER — Analyses
"""
import time
import logging
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.schemas  import AnalysisResponse, MessageResponse
from app.services import AnalysisService
from app.models   import User

logger = logging.getLogger(__name__)


class AnalysisController:

    def __init__(self, db: Session):
        self.service = AnalysisService(db)

    async def basic(self, file: UploadFile, current_user: User) -> dict:
        self.service.validate_file(file.filename, file.size or 0)
        t0 = time.time()
        df = await self.service.load_file(file)
        results = self.service.analyze_basic(df)
        elapsed = round(time.time() - t0, 3)

        record = self.service.save_history(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=file.size or 0,
            analysis_type="basic",
            results=results,
            execution_time=elapsed,
            rows_processed=len(df),
        )
        return {"id": record.id, "results": results, "execution_time": elapsed, "rows": len(df)}

    async def comprehensive(self, file: UploadFile, current_user: User) -> dict:
        self.service.validate_file(file.filename, file.size or 0)
        t0 = time.time()
        df = await self.service.load_file(file)
        results = self.service.analyze_comprehensive(df)
        elapsed = round(time.time() - t0, 3)

        record = self.service.save_history(
            user_id=current_user.id,
            file_name=file.filename,
            file_size=file.size or 0,
            analysis_type="comprehensive",
            results=results,
            execution_time=elapsed,
            rows_processed=len(df),
        )
        return {"id": record.id, "results": results, "execution_time": elapsed, "rows": len(df)}

    async def get_analysis(self, analysis_id: int, current_user: User) -> dict:
        record = self.service.get_analysis(analysis_id, current_user.id)
        return {
            "id":             record.id,
            "file_name":      record.file_name,
            "analysis_type":  record.analysis_type,
            "status":         record.status,
            "results":        record.results,
            "execution_time": record.execution_time,
            "rows_processed": record.rows_processed,
            "created_at":     str(record.created_at),
        }

    async def history(self, current_user: User, limit: int = 50) -> list:
        records = self.service.get_user_history(current_user.id, limit)
        return [
            {
                "id":            r.id,
                "file_name":     r.file_name,
                "analysis_type": r.analysis_type,
                "status":        r.status,
                "created_at":    str(r.created_at),
            }
            for r in records
        ]
