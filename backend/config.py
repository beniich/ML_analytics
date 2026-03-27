"""
Configuration settings for ML Analytics API
"""
import os
from datetime import timedelta

# API Settings
API_TITLE = "ML Analytics API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "Advanced analytics and ML insights engine"

# Database Settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ml_analytics.db")
SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", False)

# JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# MLflow Settings
MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
MLFLOW_EXPERIMENT_NAME = "ml_analytics"

# File Upload Settings
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50 MB
ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.json'}
UPLOAD_DIRECTORY = "uploads"

# Report Settings
REPORTS_DIRECTORY = "reports"
PDF_REPORT_ENABLED = True
HTML_REPORT_ENABLED = True

# Cache Settings
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CACHE_ENABLED = os.getenv("CACHE_ENABLED", False)

# CORS Settings
CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
