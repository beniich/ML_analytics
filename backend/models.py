"""
SQLAlchemy models for database tables
"""
import os
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from passlib.context import CryptContext
from datetime import datetime
import hmac
import hashlib

Base = declarative_base()

# Use Argon2id for password hashing
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__memory_cost=65536,
    argon2__rounds=3,
    argon2__parallelism=4
)

# In production, PEPPER should be loaded from environment variables
PASSWORD_PEPPER = os.getenv("PASSWORD_PEPPER", "default-dev-pepper-do-not-use-in-prod")

def get_peppered_password(password: str) -> str:
    """Combine password and pepper using HMAC for additional security"""
    hmac_obj = hmac.new(
        PASSWORD_PEPPER.encode('utf-8'),
        password.encode('utf-8'),
        hashlib.sha256
    )
    return hmac_obj.hexdigest()

class Workspace(Base):
    """Workspace model for organization of users and their generated content"""
    __tablename__ = "workspaces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    users = relationship("User", back_populates="workspace")


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    is_active = Column(Boolean, default=True, index=True)
    is_admin = Column(Boolean, default=False)
    
    # 2FA TOTP Fields
    totp_secret = Column(String(32), nullable=True)
    totp_enabled = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    workspace = relationship("Workspace", back_populates="users")
    
    def set_password(self, password: str) -> None:
        """Hash and set the user password with a pepper"""
        peppered_password = get_peppered_password(password)
        self.hashed_password = pwd_context.hash(peppered_password)
    
    def verify_password(self, password: str) -> bool:
        """Verify password against hash using pepper"""
        peppered_password = get_peppered_password(password)
        return pwd_context.verify(peppered_password, self.hashed_password)


class AnalysisReport(Base):
    """Model for storing analysis results and reports"""
    __tablename__ = "analysis_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_name = Column(String(200), nullable=False)
    report_type = Column(String(50), nullable=False)  # 'pdf', 'html', 'json'
    report_data = Column(JSON, nullable=False)
    file_path = Column(String(500))
    description = Column(Text)
    is_public = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    tags = Column(JSON)  # List of tags for organization


class AnalysisHistory(Base):
    """Track all analysis operations"""
    __tablename__ = "analysis_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String(200), nullable=False)
    file_size = Column(Integer)
    analysis_type = Column(String(100), nullable=False)
    status = Column(String(20), default="completed")  # 'processing', 'completed', 'failed'
    error_message = Column(Text)
    execution_time = Column(Float)  # seconds
    rows_processed = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MLModel(Base):
    """Track trained ML models"""
    __tablename__ = "ml_models"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    model_name = Column(String(200), nullable=False)
    model_type = Column(String(100), nullable=False)
    version = Column(String(20), default="1.0")
    mlflow_run_id = Column(String(100))
    metrics = Column(JSON)
    parameters = Column(JSON)
    description = Column(Text)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ApiKey(Base):
    """API keys for external integrations"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_name = Column(String(100), nullable=False)
    key_value = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    """Tamper-evident audit log with HMAC chaining"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    resource = Column(String(200), nullable=False)
    details = Column(Text, nullable=True)
    previous_hash = Column(String(64), nullable=False)
    signature = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
