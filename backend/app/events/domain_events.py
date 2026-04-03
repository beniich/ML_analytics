"""
EVENTS — Domain Events (dataclasses immuables)
Chaque action métier publie un événement typé.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Any, Dict


@dataclass(frozen=True)
class DomainEvent:
    """Base de tous les événements domaine."""
    occurred_at: datetime = field(default_factory=datetime.utcnow)
    correlation_id: Optional[str] = None


@dataclass(frozen=True)
class UserRegistered(DomainEvent):
    user_id:   int = 0
    username:  str = ""
    email:     str = ""


@dataclass(frozen=True)
class UserLoggedIn(DomainEvent):
    user_id:  int = 0
    username: str = ""


@dataclass(frozen=True)
class AnalysisStarted(DomainEvent):
    user_id:       int = 0
    file_name:     str = ""
    analysis_type: str = ""


@dataclass(frozen=True)
class AnalysisCompleted(DomainEvent):
    user_id:        int   = 0
    analysis_id:    int   = 0
    file_name:      str   = ""
    analysis_type:  str   = ""
    execution_time: float = 0.0
    rows_processed: int   = 0


@dataclass(frozen=True)
class AnalysisFailed(DomainEvent):
    user_id:   int = 0
    file_name: str = ""
    error:     str = ""


@dataclass(frozen=True)
class JobCreated(DomainEvent):
    user_id:  int = 0
    job_id:   int = 0
    job_name: str = ""
    job_type: str = ""


@dataclass(frozen=True)
class JobCompleted(DomainEvent):
    job_id:   int = 0
    user_id:  int = 0
    job_name: str = ""


@dataclass(frozen=True)
class JobFailed(DomainEvent):
    job_id:  int = 0
    user_id: int = 0
    error:   str = ""
