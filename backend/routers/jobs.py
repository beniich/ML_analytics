"""
Job Scheduler Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
import logging
import random

from database import get_db
from models import User
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/jobs", tags=["Job Scheduler"])

# In-memory job store (replace with DB table in production)
_jobs: dict = {}
_job_id_counter = 1


def _next_id():
    global _job_id_counter
    jid = _job_id_counter
    _job_id_counter += 1
    return jid


@router.get("")
async def list_jobs(current_user: User = Depends(get_current_user)):
    """List all scheduled jobs for the current user"""
    user_jobs = [j for j in _jobs.values() if j["user_id"] == current_user.id]
    return {"total": len(user_jobs), "jobs": user_jobs}


@router.get("/stats")
async def job_stats(current_user: User = Depends(get_current_user)):
    """Return job statistics"""
    user_jobs = [j for j in _jobs.values() if j["user_id"] == current_user.id]
    active = [j for j in user_jobs if j["status"] == "active"]
    paused = [j for j in user_jobs if j["status"] == "paused"]
    completed = [j for j in user_jobs if j["status"] == "completed"]
    return {
        "total": len(user_jobs),
        "total_active": len(active),
        "total_paused": len(paused),
        "total_completed": len(completed),
    }


@router.get("/{job_id}")
async def get_job(job_id: int, current_user: User = Depends(get_current_user)):
    """Get a specific job"""
    job = _jobs.get(job_id)
    if not job or job["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/schedule-analysis")
async def schedule_analysis(
    name: str,
    cron: str = "0 * * * *",
    analysis_type: str = "basic",
    current_user: User = Depends(get_current_user)
):
    """Schedule an analysis job"""
    jid = _next_id()
    job = {
        "id": jid,
        "user_id": current_user.id,
        "name": name,
        "type": "analysis",
        "analysis_type": analysis_type,
        "cron": cron,
        "status": "active",
        "created_at": datetime.utcnow().isoformat(),
        "last_run": None,
        "next_run": datetime.utcnow().isoformat(),
        "runs": 0,
    }
    _jobs[jid] = job
    return {"status": "scheduled", "job": job}


@router.post("/schedule-report")
async def schedule_report(
    name: str,
    cron: str = "0 8 * * 1",
    report_format: str = "html",
    current_user: User = Depends(get_current_user)
):
    """Schedule a report generation job"""
    jid = _next_id()
    job = {
        "id": jid,
        "user_id": current_user.id,
        "name": name,
        "type": "report",
        "report_format": report_format,
        "cron": cron,
        "status": "active",
        "created_at": datetime.utcnow().isoformat(),
        "last_run": None,
        "next_run": datetime.utcnow().isoformat(),
        "runs": 0,
    }
    _jobs[jid] = job
    return {"status": "scheduled", "job": job}


@router.put("/{job_id}/pause")
async def pause_job(job_id: int, current_user: User = Depends(get_current_user)):
    """Pause a job"""
    job = _jobs.get(job_id)
    if not job or job["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    job["status"] = "paused"
    return {"status": "paused", "job_id": job_id}


@router.put("/{job_id}/resume")
async def resume_job(job_id: int, current_user: User = Depends(get_current_user)):
    """Resume a paused job"""
    job = _jobs.get(job_id)
    if not job or job["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    job["status"] = "active"
    return {"status": "active", "job_id": job_id}


@router.delete("/{job_id}")
async def delete_job(job_id: int, current_user: User = Depends(get_current_user)):
    """Delete a job"""
    job = _jobs.get(job_id)
    if not job or job["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    del _jobs[job_id]
    return {"status": "deleted", "job_id": job_id}


@router.get("/{job_id}/history")
async def job_history(job_id: int, current_user: User = Depends(get_current_user)):
    """Get execution history for a job"""
    job = _jobs.get(job_id)
    if not job or job["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    # Mock history
    history = [
        {
            "run_id": i,
            "started_at": datetime.utcnow().isoformat(),
            "status": "completed" if i % 5 != 0 else "failed",
            "duration_ms": random.randint(200, 2000),
        }
        for i in range(1, min(job.get("runs", 0) + 1, 11))
    ]
    return {"job_id": job_id, "history": history}
