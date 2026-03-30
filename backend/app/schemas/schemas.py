"""
SCHEMAS Pydantic — Validation des entrées/sorties API
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime


# ═══════════════════════ USER ════════════════════════════════════════════════

class UserCreate(BaseModel):
    username:  str      = Field(..., min_length=3, max_length=50)
    email:     EmailStr
    password:  str      = Field(..., min_length=8)
    full_name: Optional[str] = None

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Caractères non autorisés dans le nom d'utilisateur")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id:         int
    username:   str
    email:      str
    full_name:  Optional[str]
    is_active:  bool
    is_admin:   bool
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name:  Optional[str]  = None
    email:      Optional[EmailStr] = None
    avatar_url: Optional[str]  = None


# ═══════════════════════ TOKEN ════════════════════════════════════════════════

class Token(BaseModel):
    access_token:  str
    refresh_token: Optional[str] = None
    token_type:    str = "bearer"


class TokenData(BaseModel):
    username:   Optional[str] = None
    user_id:    Optional[int] = None
    is_admin:   bool = False


# ═══════════════════════ ANALYSIS ════════════════════════════════════════════

class AnalysisRequest(BaseModel):
    analysis_type:       str = "basic"         # basic | comprehensive | timeseries
    include_predictions: bool = False


class AnalysisResponse(BaseModel):
    id:            int
    file_name:     str
    analysis_type: str
    status:        str
    results:       Optional[dict] = None
    execution_time: Optional[float] = None
    rows_processed: Optional[int]   = None
    created_at:    Optional[datetime] = None

    model_config = {"from_attributes": True}


# ═══════════════════════ JOB ═════════════════════════════════════════════════

class JobCreate(BaseModel):
    job_name:  str = Field(..., min_length=3, max_length=255)
    job_type:  str = Field(..., pattern="^(analysis|export|report)$")
    frequency: str = Field(..., pattern="^(once|hourly|daily|weekly|monthly)$")
    config:    Optional[dict] = None


class JobResponse(BaseModel):
    id:        int
    job_name:  str
    job_type:  str
    frequency: str
    status:    str
    is_active: bool
    next_run:  Optional[datetime] = None
    last_run:  Optional[datetime] = None

    model_config = {"from_attributes": True}


# ═══════════════════════ REPORT ═══════════════════════════════════════════════

class ReportCreate(BaseModel):
    report_name:  str = Field(..., min_length=3, max_length=200)
    report_type:  str = Field(..., pattern="^(pdf|html|json)$")
    description:  Optional[str] = None
    is_public:    bool = False
    tags:         Optional[List[str]] = None


class ReportResponse(BaseModel):
    id:          int
    report_name: str
    report_type: str
    is_public:   bool
    file_path:   Optional[str] = None
    created_at:  Optional[datetime] = None

    model_config = {"from_attributes": True}


# ═══════════════════════ COMMON ═══════════════════════════════════════════════

class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PaginatedResponse(BaseModel):
    items:       list
    total:       int
    page:        int
    per_page:    int
    total_pages: int
