"""
SERVICE — Jobs planifiés
"""
import logging
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models import Job, JobStatus
from app.schemas import JobCreate
from app.utils.exceptions import NotFoundException, ForbiddenException

logger = logging.getLogger(__name__)


class JobService:
    def __init__(self, db: Session):
        self.db = db

    def _next_run(self, frequency: str) -> datetime:
        now = datetime.utcnow()
        return {
            "once":    now,
            "hourly":  now + timedelta(hours=1),
            "daily":   now + timedelta(days=1),
            "weekly":  now + timedelta(weeks=1),
            "monthly": now + timedelta(days=30),
        }.get(frequency, now)

    def create_job(self, user_id: int, data: JobCreate) -> Job:
        job = Job(
            user_id   = user_id,
            job_name  = data.job_name,
            job_type  = data.job_type,
            frequency = data.frequency,
            config    = data.config or {},
            next_run  = self._next_run(data.frequency),
            status    = JobStatus.PENDING,
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        logger.info(f"✅ Job créé : {job.id}")
        return job

    def get_user_jobs(self, user_id: int) -> List[Job]:
        return self.db.query(Job).filter(Job.user_id == user_id).all()

    def get_job(self, job_id: int, user_id: int) -> Job:
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise NotFoundException("Job introuvable")
        if job.user_id != user_id:
            raise ForbiddenException("Accès refusé à ce job")
        return job

    def pause_job(self, job_id: int, user_id: int) -> Job:
        job = self.get_job(job_id, user_id)
        job.is_active = False
        self.db.commit()
        return job

    def resume_job(self, job_id: int, user_id: int) -> Job:
        job = self.get_job(job_id, user_id)
        job.is_active = True
        self.db.commit()
        return job

    def delete_job(self, job_id: int, user_id: int) -> None:
        job = self.get_job(job_id, user_id)
        self.db.delete(job)
        self.db.commit()
        logger.info(f"🗑️ Job supprimé : {job_id}")

    def update_job_status(self, job_id: int, status: JobStatus, error: Optional[str] = None):
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status     = status
            job.last_run   = datetime.utcnow()
            job.last_error = error
            if status == JobStatus.COMPLETED:
                job.successful_runs += 1
            elif status == JobStatus.FAILED:
                job.failed_runs += 1
            job.total_runs += 1
            self.db.commit()
