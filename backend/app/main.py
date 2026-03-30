"""
ML Analytics API — Point d'entrée MVC
Architecture : Routes → Controllers → Services → Models → Database

Pour lancer :
    cd backend
    uvicorn app.main:app --reload
"""
import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.config     import (API_TITLE, API_VERSION, API_DESCRIPTION,
                             CORS_ORIGINS, UPLOAD_DIRECTORY, REPORTS_DIRECTORY, LOG_LEVEL)
from app.database   import init_db
from app.routes     import v1_router
from app.middleware import LoggingMiddleware, SecurityMiddleware, ErrorMiddleware

# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ── Application ────────────────────────────────────────────────────────────
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


# ── Middleware (ordre : externe → interne) ─────────────────────────────────
app.add_middleware(ErrorMiddleware)          # 1. capture toutes les exceptions
app.add_middleware(SecurityMiddleware)       # 2. headers sécurité
app.add_middleware(LoggingMiddleware)        # 3. log chaque requête
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routers MVC ────────────────────────────────────────────────────────────
app.include_router(v1_router)


# ── Compatibilité : inclure les anciens routers si présents ───────────────
try:
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # backend/
    from routers import (
        billing_router, engineering_router, jobs_router,
        monitoring_router, quality_router, support_router,
        timeseries_router, transform_router,
    )
    app.include_router(quality_router)
    app.include_router(jobs_router)
    app.include_router(transform_router)
    app.include_router(timeseries_router)
    app.include_router(engineering_router)
    app.include_router(monitoring_router)
    app.include_router(billing_router)
    app.include_router(support_router)
    logger.info("✅ Anciens routers chargés (compatibilité)")
except Exception as e:
    logger.warning(f"⚠️  Anciens routers non chargés : {e}")


# ── Startup / Shutdown ─────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()
    os.makedirs(UPLOAD_DIRECTORY,  exist_ok=True)
    os.makedirs(REPORTS_DIRECTORY, exist_ok=True)
    logger.info(f"🚀 {API_TITLE} v{API_VERSION} démarré — Architecture MVC")


@app.on_event("shutdown")
async def shutdown():
    logger.info("🛑 Application arrêtée")


# ── Health & Info ──────────────────────────────────────────────────────────
@app.get("/api/health", tags=["🏥 Health"])
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "version": API_VERSION}


@app.get("/api/info", tags=["ℹ️ Info"])
async def info():
    return {
        "title":       API_TITLE,
        "version":     API_VERSION,
        "description": API_DESCRIPTION,
        "architecture": "MVC (Model-View-Controller)",
        "layers": {
            "routes":      "app/routes/",
            "controllers": "app/controllers/",
            "services":    "app/services/",
            "models":      "app/models/",
            "database":    "app/database/",
            "middleware":  "app/middleware/",
            "schemas":     "app/schemas/",
        },
        "endpoints": len([r for r in app.routes]),
    }


# ── Entrée directe ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
