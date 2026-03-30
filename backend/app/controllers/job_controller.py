"""
CONTROLLER — Jobs planifiés
"""
import logging
from typing import List
from sqlalchemy.orm import Session

from app.schemas  import JobCreate, JobResponse, MessageResponse
from app.services import JobService
from app.models   import User

logger = logging.getLogger(__name__)


class JobController:

    def __init__(self, db: Session):
        self.service = JobService(db)

    async def create(self, data: JobCreate, user: User) -> JobResponse:
        job = self.service.create_job(user.id, data)
        return JobResponse.model_validate(job)

    async def list_jobs(self, user: User) -> List[JobResponse]:
        jobs = self.service.get_user_jobs(user.id)
        return [JobResponse.model_validate(j) for j in jobs]

    async def get(self, job_id: int, user: User) -> JobResponse:
        job = self.service.get_job(job_id, user.id)
        return JobResponse.model_validate(job)

    async def pause(self, job_id: int, user: User) -> MessageResponse:
        self.service.pause_job(job_id, user.id)
        return MessageResponse(message="Job mis en pause")

    async def resume(self, job_id: int, user: User) -> MessageResponse:
        self.service.resume_job(job_id, user.id)
        return MessageResponse(message="Job repris")

    async def delete(self, job_id: int, user: User) -> MessageResponse:
        self.service.delete_job(job_id, user.id)
        return MessageResponse(message="Job supprimé")
