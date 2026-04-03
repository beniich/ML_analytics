"""
REPOSITORY — Jobs
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Job, JobStatus
from .base_repository import BaseRepository


class JobRepository(BaseRepository[Job]):

    def __init__(self, db: Session):
        super().__init__(Job, db)

    def get_user_jobs(self, user_id: int) -> List[Job]:
        return self.filter_by(user_id=user_id)

    def get_user_job(self, job_id: int, user_id: int) -> Optional[Job]:
        return (
            self.db.query(Job)
            .filter(Job.id == job_id, Job.user_id == user_id)
            .first()
        )

    def get_pending_jobs(self) -> List[Job]:
        return self.filter_by(status=JobStatus.PENDING, is_active=True)

    def get_active_jobs(self) -> List[Job]:
        return self.filter_by(is_active=True)
