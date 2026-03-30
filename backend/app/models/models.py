"""
MODÈLES SQLAlchemy — repris et organisés depuis backend/models.py
Chaque classe correspond à une table de la base de données.
"""
import os
import hmac
import hashlib
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float,
    Text, JSON, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from passlib.context import CryptContext
import enum

from app.database.session import Base


# ── Password utilities ─────────────────────────────────────────────────────
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__memory_cost=65536,
    argon2__rounds=3,
    argon2__parallelism=4,
)

PASSWORD_PEPPER = os.getenv("PASSWORD_PEPPER", "default-dev-pepper-do-not-use-in-prod")


def _peppered(password: str) -> str:
    return hmac.new(
        PASSWORD_PEPPER.encode(), password.encode(), hashlib.sha256
    ).hexdigest()


# ── Enums ──────────────────────────────────────────────────────────────────
class JobStatus(str, enum.Enum):
    PENDING   = "pending"
    RUNNING   = "running"
    COMPLETED = "completed"
    FAILED    = "failed"
    CANCELLED = "cancelled"


# ── Workspace ──────────────────────────────────────────────────────────────
class Workspace(Base):
    """Espace de travail — regroupe des utilisateurs."""
    __tablename__ = "workspaces"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    users = relationship("User", back_populates="workspace")

    def __repr__(self):
        return f"<Workspace {self.name}>"


# ── User ───────────────────────────────────────────────────────────────────
class User(Base):
    """Utilisateur — authentification, autorisation, profil."""
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)

    # Identifiants
    username = Column(String(50),  unique=True, index=True, nullable=False)
    email    = Column(String(100), unique=True, index=True, nullable=False)

    # Mot de passe
    hashed_password      = Column(String(255), nullable=False)
    password_changed_at  = Column(DateTime(timezone=True))

    # Profil
    full_name  = Column(String(100))
    avatar_url = Column(String(255))

    # État
    is_active  = Column(Boolean, default=True,  index=True)
    is_verified= Column(Boolean, default=False)
    is_admin   = Column(Boolean, default=False)

    # 2FA / TOTP
    totp_secret  = Column(String(32),  nullable=True)
    totp_enabled = Column(Boolean, default=False)

    # Sécurité
    failed_login_attempts = Column(Integer, default=0)
    locked_until          = Column(DateTime(timezone=True), nullable=True)
    last_login            = Column(DateTime(timezone=True), nullable=True)
    login_attempts        = Column(JSON, default=list)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    workspace = relationship("Workspace", back_populates="users")
    jobs      = relationship("Job",            back_populates="user", cascade="all, delete-orphan")
    api_keys  = relationship("ApiKey",         back_populates="user", cascade="all, delete-orphan")

    # Méthodes
    def set_password(self, password: str) -> None:
        self.hashed_password = pwd_context.hash(_peppered(password))

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(_peppered(password), self.hashed_password)

    def is_locked(self) -> bool:
        if self.locked_until and datetime.utcnow() < self.locked_until:
            return True
        return False

    def unlock(self):
        self.locked_until             = None
        self.failed_login_attempts    = 0

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "username":   self.username,
            "email":      self.email,
            "full_name":  self.full_name,
            "is_active":  self.is_active,
            "is_admin":   self.is_admin,
            "created_at": str(self.created_at),
        }

    def __repr__(self):
        return f"<User {self.username}>"


# ── AnalysisReport ─────────────────────────────────────────────────────────
class AnalysisReport(Base):
    """Rapport d'analyse stocké en base."""
    __tablename__ = "analysis_reports"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_name = Column(String(200), nullable=False)
    report_type = Column(String(50),  nullable=False)   # pdf | html | json
    report_data = Column(JSON,        nullable=False)
    file_path   = Column(String(500))
    description = Column(Text)
    is_public   = Column(Boolean, default=False, index=True)
    tags        = Column(JSON)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<AnalysisReport {self.report_name}>"


# ── AnalysisHistory ────────────────────────────────────────────────────────
class AnalysisHistory(Base):
    """Historique de toutes les analyses effectuées."""
    __tablename__ = "analysis_history"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name      = Column(String(200), nullable=False)
    file_size      = Column(Integer)
    analysis_type  = Column(String(100), nullable=False)
    status         = Column(String(20),  default="completed")  # processing | completed | failed
    error_message  = Column(Text)
    execution_time = Column(Float)    # secondes
    rows_processed = Column(Integer)
    results        = Column(JSON)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<AnalysisHistory {self.file_name}>"


# ── MLModel ────────────────────────────────────────────────────────────────
class MLModel(Base):
    """Modèle ML entraîné et suivi via MLflow."""
    __tablename__ = "ml_models"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    model_name    = Column(String(200), nullable=False)
    model_type    = Column(String(100), nullable=False)
    version       = Column(String(20),  default="1.0")
    mlflow_run_id = Column(String(100))
    metrics       = Column(JSON)
    parameters    = Column(JSON)
    description   = Column(Text)
    is_active     = Column(Boolean, default=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<MLModel {self.model_name} v{self.version}>"


# ── ApiKey ─────────────────────────────────────────────────────────────────
class ApiKey(Base):
    """Clé API pour intégrations externes."""
    __tablename__ = "api_keys"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_name   = Column(String(100), nullable=False)
    key_value  = Column(String(255), nullable=False, unique=True)
    is_active  = Column(Boolean, default=True)
    last_used  = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="api_keys")

    def __repr__(self):
        return f"<ApiKey {self.key_name}>"


# ── AuditLog ───────────────────────────────────────────────────────────────
class AuditLog(Base):
    """Journal d'audit inaltérable avec chaînage HMAC."""
    __tablename__ = "audit_logs"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    action        = Column(String(100), nullable=False)
    resource      = Column(String(200), nullable=False)
    details       = Column(Text, nullable=True)
    previous_hash = Column(String(64), nullable=False)
    signature     = Column(String(64), nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource}>"


# ── Job ────────────────────────────────────────────────────────────────────
class Job(Base):
    """Job planifié (analyse, export, rapport)."""
    __tablename__ = "jobs"

    id       = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    job_name  = Column(String(255), nullable=False)
    job_type  = Column(String(50))   # analysis | export | report
    frequency = Column(String(20))   # once | hourly | daily | weekly | monthly

    status         = Column(String(20), default=JobStatus.PENDING)
    next_run       = Column(DateTime(timezone=True))
    last_run       = Column(DateTime(timezone=True), nullable=True)
    config         = Column(JSON)
    last_result    = Column(JSON)
    last_error     = Column(String(500))

    total_runs      = Column(Integer, default=0)
    successful_runs = Column(Integer, default=0)
    failed_runs     = Column(Integer, default=0)

    is_active     = Column(Boolean, default=True)
    max_retries   = Column(Integer, default=3)
    current_retry = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="jobs")

    def to_dict(self) -> dict:
        return {
            "id":        self.id,
            "job_name":  self.job_name,
            "job_type":  self.job_type,
            "frequency": self.frequency,
            "status":    self.status,
            "next_run":  str(self.next_run) if self.next_run else None,
            "is_active": self.is_active,
        }

    def __repr__(self):
        return f"<Job {self.job_name} [{self.status}]>"
