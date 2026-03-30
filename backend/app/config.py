"""
Configuration settings — ML Analytics API (MVC)
Repris et enrichi depuis backend/config.py
"""
import os
from typing import List


# ── API ────────────────────────────────────────────────────────────────────
API_TITLE       = "ML Analytics API"
API_VERSION     = "1.0.0"
API_DESCRIPTION = "Advanced analytics and ML insights engine — Architecture MVC"

# ── Environment ────────────────────────────────────────────────────────────
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG       = ENVIRONMENT == "development"

# ── Database ───────────────────────────────────────────────────────────────
DATABASE_URL    = os.getenv("DATABASE_URL", "sqlite:///./ml_analytics.db")
SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "false").lower() == "true"

# ── JWT / Auth ─────────────────────────────────────────────────────────────
SECRET_KEY                    = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM                     = "RS256"          # RS256 via clés RSA (auth.py)
ACCESS_TOKEN_EXPIRE_MINUTES   = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS     = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS",   "7"))

# RSA key paths (utilisés par le module auth)
JWT_PRIVATE_KEY_PATH = os.getenv("JWT_PRIVATE_KEY_PATH", "private_key.pem")
JWT_PUBLIC_KEY_PATH  = os.getenv("JWT_PUBLIC_KEY_PATH",  "public_key.pem")

# ── Redis ──────────────────────────────────────────────────────────────────
REDIS_URL     = os.getenv("REDIS_URL", "redis://localhost:6379")
CACHE_ENABLED = os.getenv("CACHE_ENABLED", "false").lower() == "true"

# ── File Upload ────────────────────────────────────────────────────────────
MAX_UPLOAD_SIZE    = 50 * 1024 * 1024           # 50 MB
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".json", ".parquet"}
UPLOAD_DIRECTORY   = os.getenv("UPLOAD_DIRECTORY",  "uploads")
REPORTS_DIRECTORY  = os.getenv("REPORTS_DIRECTORY", "reports")

# ── MLflow ─────────────────────────────────────────────────────────────────
MLFLOW_TRACKING_URI    = os.getenv("MLFLOW_TRACKING_URI",    "http://localhost:5000")
MLFLOW_EXPERIMENT_NAME = os.getenv("MLFLOW_EXPERIMENT_NAME", "ml_analytics")

# ── CORS ───────────────────────────────────────────────────────────────────
CORS_ORIGINS: List[str] = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

# ── Logging ────────────────────────────────────────────────────────────────
LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG" if DEBUG else "INFO")
