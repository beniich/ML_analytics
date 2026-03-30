"""
ML Analytics API - Main Application
Harmonized FastAPI backend with all modules
"""
import logging
import os
import traceback
from datetime import datetime

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

# Core modules
from config import (API_DESCRIPTION, API_TITLE, API_VERSION, CORS_ORIGINS,
                    MAX_UPLOAD_SIZE, REPORTS_DIRECTORY, UPLOAD_DIRECTORY)
from database import engine, init_db

# All new routers
from routers.auth_router import router as auth_router
from routers.analysis_router import router as analysis_router
from routers.reports_router import router as reports_router
from routers.users_router import router as users_router
from routers import (
    billing_router,
    engineering_router,
    jobs_router,
    monitoring_router,
    quality_router,
    support_router,
    timeseries_router,
    transform_router,
)

# Optional: advanced endpoints
try:
    from advanced_endpoints import router as advanced_router
    _advanced_available = True
except ImportError:
    _advanced_available = False

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ── App --------------------------------------------------------------------
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup ----------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    init_db()
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    os.makedirs(REPORTS_DIRECTORY, exist_ok=True)
    logger.info("✅ Application started — DB initialized")


# ── Include all routers -------------------------------------------------------
app.include_router(auth_router)
app.include_router(analysis_router)
app.include_router(reports_router)
app.include_router(users_router)
app.include_router(quality_router)
app.include_router(jobs_router)
app.include_router(transform_router)
app.include_router(timeseries_router)
app.include_router(engineering_router)
app.include_router(monitoring_router)
app.include_router(billing_router)
app.include_router(support_router)

if _advanced_available:
    app.include_router(advanced_router)
    logger.info("✅ Advanced endpoints loaded")


# ── HEALTH & INFO ----------------------------------------------------------

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "version": API_VERSION}


@app.get("/api/info", tags=["Info"])
async def api_info():
    return {
        "title": API_TITLE,
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "modules": [
            "authentication", "analysis", "data_quality", "job_scheduler",
            "data_transformation", "time_series", "feature_engineering",
            "monitoring", "billing", "support", "reports", "users"
        ],
        "endpoints_count": len([r for r in app.routes]),
    }


# ── Entry point  -----------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
