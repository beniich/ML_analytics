"""
ROUTES — Jobs planifiés  /api/v1/jobs
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import JobController
from app.schemas     import JobCreate, JobResponse, MessageResponse
from app.database    import get_db
from app.dependencies import get_current_user
from app.models      import User

router = APIRouter(prefix="/api/v1/jobs", tags=["⚙️ Jobs"])


@router.post("/", response_model=JobResponse, status_code=201, summary="Créer un job planifié")
async def create_job(
    data:         JobCreate,
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await JobController(db).create(data, current_user)


@router.get("/", response_model=List[JobResponse], summary="Mes jobs")
async def list_jobs(
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await JobController(db).list_jobs(current_user)


@router.get("/{job_id}", response_model=JobResponse, summary="Détail d'un job")
async def get_job(
    job_id:       int,
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await JobController(db).get(job_id, current_user)


@router.put("/{job_id}/pause", response_model=MessageResponse, summary="Mettre en pause")
async def pause_job(
    job_id:       int,
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await JobController(db).pause(job_id, current_user)


@router.put("/{job_id}/resume", response_model=MessageResponse, summary="Reprendre")
async def resume_job(
    job_id:       int,
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await JobController(db).resume(job_id, current_user)


@router.delete("/{job_id}", response_model=MessageResponse, summary="Supprimer un job")
async def delete_job(
    job_id:       int,
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await JobController(db).delete(job_id, current_user)
