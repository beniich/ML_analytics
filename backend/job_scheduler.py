"""
Job Scheduling Module
Schedule and manage background analysis tasks
"""
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
import json
import logging
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON as SQLJSON
from sqlalchemy.ext.declarative import declarative_base

logger = logging.getLogger(__name__)

Base = declarative_base()


class JobStatus(str, Enum):
    """Job status enumeration"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class JobFrequency(str, Enum):
    """Job frequency options"""
    ONCE = "once"
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


class ScheduledJob(Base):
    """Database model for scheduled jobs"""
    __tablename__ = "scheduled_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    job_name = Column(String(200), nullable=False)
    job_type = Column(String(50), nullable=False)  # 'analysis', 'report', 'export'
    description = Column(Text)
    status = Column(String(20), default=JobStatus.PENDING)
    
    # Scheduling
    frequency = Column(String(20), default=JobFrequency.ONCE)
    next_run = Column(DateTime(timezone=True))
    last_run = Column(DateTime(timezone=True))
    
    # Job configuration
    job_config = Column(SQLJSON)  # Store job parameters
    
    # Status tracking
    total_runs = Column(Integer, default=0)
    successful_runs = Column(Integer, default=0)
    failed_runs = Column(Integer, default=0)
    last_error = Column(Text)
    
    # Timing
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    max_retries = Column(Integer, default=3)
    current_retry = Column(Integer, default=0)


class JobScheduler:
    """Manages job scheduling and execution"""
    
    def __init__(self):
        self.jobs: Dict[int, Dict[str, Any]] = {}
        self.execution_history: List[Dict[str, Any]] = []
    
    def create_job(
        self,
        user_id: int,
        job_name: str,
        job_type: str,
        job_config: Dict[str, Any],
        frequency: JobFrequency = JobFrequency.ONCE,
        description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new scheduled job"""
        try:
            job = {
                "user_id": user_id,
                "job_name": job_name,
                "job_type": job_type,
                "job_config": job_config,
                "frequency": frequency.value,
                "description": description,
                "status": JobStatus.PENDING.value,
                "next_run": self._calculate_next_run(frequency),
                "created_at": datetime.utcnow().isoformat(),
                "total_runs": 0,
                "successful_runs": 0,
                "failed_runs": 0
            }
            
            logger.info(f"Job created: {job_name} for user {user_id}")
            return job
        except Exception as e:
            logger.error(f"Error creating job: {str(e)}")
            raise
    
    def schedule_analysis(
        self,
        user_id: int,
        file_path: str,
        analysis_types: List[str],
        frequency: JobFrequency = JobFrequency.DAILY
    ) -> Dict[str, Any]:
        """Schedule a periodic analysis job"""
        job_config = {
            "file_path": file_path,
            "analysis_types": analysis_types,
            "include_anomaly_detection": True,
            "use_cache": True
        }
        
        return self.create_job(
            user_id=user_id,
            job_name=f"Analysis: {file_path}",
            job_type="analysis",
            job_config=job_config,
            frequency=frequency,
            description=f"Scheduled {frequency.value} analysis of {file_path}"
        )
    
    def schedule_report(
        self,
        user_id: int,
        report_name: str,
        data_sources: List[str],
        frequency: JobFrequency = JobFrequency.WEEKLY,
        recipients: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Schedule a periodic report generation"""
        job_config = {
            "report_name": report_name,
            "data_sources": data_sources,
            "email_recipients": recipients or [],
            "report_format": "html",
            "include_charts": True
        }
        
        return self.create_job(
            user_id=user_id,
            job_name=f"Report: {report_name}",
            job_type="report",
            job_config=job_config,
            frequency=frequency,
            description=f"Scheduled {frequency.value} report generation"
        )
    
    def schedule_export(
        self,
        user_id: int,
        source_file: str,
        export_formats: List[str],
        frequency: JobFrequency = JobFrequency.DAILY
    ) -> Dict[str, Any]:
        """Schedule periodic data export"""
        job_config = {
            "source_file": source_file,
            "export_formats": export_formats,
            "include_analysis": True,
            "compress_output": True
        }
        
        return self.create_job(
            user_id=user_id,
            job_name=f"Export: {source_file}",
            job_type="export",
            job_config=job_config,
            frequency=frequency
        )
    
    def _calculate_next_run(self, frequency: JobFrequency) -> datetime:
        """Calculate next run time based on frequency"""
        now = datetime.utcnow()
        
        if frequency == JobFrequency.ONCE:
            return now + timedelta(seconds=1)
        elif frequency == JobFrequency.HOURLY:
            return now + timedelta(hours=1)
        elif frequency == JobFrequency.DAILY:
            return now + timedelta(days=1)
        elif frequency == JobFrequency.WEEKLY:
            return now + timedelta(weeks=1)
        elif frequency == JobFrequency.MONTHLY:
            return now + timedelta(days=30)
        else:
            return now + timedelta(days=1)
    
    def get_jobs_for_user(self, user_id: int) -> List[Dict[str, Any]]:
        """Get all jobs for a user"""
        return [job for job in self.jobs.values() if job["user_id"] == user_id]
    
    def get_pending_jobs(self) -> List[Dict[str, Any]]:
        """Get all pending jobs that need to run"""
        now = datetime.utcnow()
        pending = []
        
        for job in self.jobs.values():
            if (job["status"] in [JobStatus.PENDING.value, JobStatus.PAUSED.value] and
                job["next_run"] and
                datetime.fromisoformat(job["next_run"]) <= now and
                job["is_active"]):
                pending.append(job)
        
        return pending
    
    def update_job_status(
        self,
        job_id: int,
        status: JobStatus,
        error_message: Optional[str] = None
    ) -> bool:
        """Update job status"""
        if job_id in self.jobs:
            job = self.jobs[job_id]
            job["status"] = status.value
            
            if status == JobStatus.COMPLETED:
                job["successful_runs"] += 1
                job["total_runs"] += 1
                job["last_run"] = datetime.utcnow().isoformat()
            elif status == JobStatus.FAILED:
                job["failed_runs"] += 1
                job["total_runs"] += 1
                job["last_error"] = error_message
                job["current_retry"] += 1
            
            if status == JobStatus.COMPLETED or (status == JobStatus.FAILED and job["current_retry"] >= job.get("max_retries", 3)):
                job["next_run"] = self._calculate_next_run(JobFrequency(job["frequency"])).isoformat()
                job["current_retry"] = 0
            
            logger.info(f"Job {job_id} status updated to {status.value}")
            return True
        
        return False
    
    def pause_job(self, job_id: int) -> bool:
        """Pause a job"""
        return self.update_job_status(job_id, JobStatus.PAUSED)
    
    def resume_job(self, job_id: int) -> bool:
        """Resume a paused job"""
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = JobStatus.PENDING.value
            return True
        return False
    
    def delete_job(self, job_id: int) -> bool:
        """Delete a job"""
        if job_id in self.jobs:
            del self.jobs[job_id]
            logger.info(f"Job {job_id} deleted")
            return True
        return False
    
    def get_job_execution_history(self, job_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """Get execution history for a job"""
        return [
            execution for execution in self.execution_history
            if execution["job_id"] == job_id
        ][:limit]
    
    def log_execution(
        self,
        job_id: int,
        status: JobStatus,
        execution_time_seconds: float,
        result: Optional[Dict] = None,
        error: Optional[str] = None
    ) -> None:
        """Log job execution"""
        execution = {
            "job_id": job_id,
            "status": status.value,
            "timestamp": datetime.utcnow().isoformat(),
            "execution_time_seconds": execution_time_seconds,
            "result": result,
            "error": error
        }
        
        self.execution_history.append(execution)
        
        # Keep only last 100 executions per job
        job_executions = [e for e in self.execution_history if e["job_id"] == job_id]
        if len(job_executions) > 100:
            oldest = min(job_executions, key=lambda x: x["timestamp"])
            self.execution_history.remove(oldest)
    
    def get_scheduler_stats(self) -> Dict[str, Any]:
        """Get scheduler statistics"""
        return {
            "total_jobs": len(self.jobs),
            "active_jobs": sum(1 for j in self.jobs.values() if j.get("is_active")),
            "pending_jobs": sum(1 for j in self.jobs.values() if j["status"] == JobStatus.PENDING.value),
            "running_jobs": sum(1 for j in self.jobs.values() if j["status"] == JobStatus.RUNNING.value),
            "failed_jobs": sum(1 for j in self.jobs.values() if j["status"] == JobStatus.FAILED.value),
            "total_executions": len(self.execution_history),
            "job_types": {
                "analysis": sum(1 for j in self.jobs.values() if j["job_type"] == "analysis"),
                "report": sum(1 for j in self.jobs.values() if j["job_type"] == "report"),
                "export": sum(1 for j in self.jobs.values() if j["job_type"] == "export")
            }
        }


# Global scheduler instance
job_scheduler = JobScheduler()
