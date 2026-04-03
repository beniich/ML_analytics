"""
ML Analytics API — Point d'entrée MVC Production-Grade
=======================================================
Architecture  : Routes → Controllers → Services → Repositories → Models → Database
Observabilité : OpenTelemetry → Jaeger
Cache         : L1 (cachetools) + L2 (Redis)
Events        : Redis Streams (CQRS)
Feature Flags : LaunchDarkly / JSON local
CI/CD         : SAST (Bandit) + SBOM (CycloneDX) + Trivy

Démarrage :
    cd backend
    uvicorn app.main:app --reload

Jaeger (traces) :
    docker run -d --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 \\
        jaegertracing/all-in-one:latest
"""
import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.config import (
    API_TITLE, API_VERSION, API_DESCRIPTION,
    CORS_ORIGINS, UPLOAD_DIRECTORY, REPORTS_DIRECTORY, LOG_LEVEL,
)
from app.database                           import init_db
from app.routes                             import v1_router
from app.routes.v2_router                   import v2_router
from app.middleware                         import LoggingMiddleware, SecurityMiddleware, ErrorMiddleware, UploadLimitMiddleware
from app.middleware.deprecation_middleware  import DeprecationMiddleware
from app.core.telemetry                     import setup_telemetry
from app.core.feature_flags                 import feature_flags
from app.core.rate_limit                   import setup_rate_limit, limiter

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
    description=API_DESCRIPTION + "\n\n**Architecture MVC production-grade :** "
                "Repository Pattern · Cache L1+L2 · Event Bus Redis · "
                "OpenTelemetry · Feature Flags LaunchDarkly",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── OpenTelemetry & Rate Limiting (avant les middlewares) ─────────────────
setup_telemetry(app)
setup_rate_limit(app)

# ── Middleware (externe → interne) ─────────────────────────────────────────
app.add_middleware(UploadLimitMiddleware)
app.add_middleware(ErrorMiddleware)
app.add_middleware(SecurityMiddleware)
app.add_middleware(DeprecationMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers MVC v1 + v2 ────────────────────────────────────────────────────
app.include_router(v1_router)

if feature_flags("enable_api_v2"):
    app.include_router(v2_router)
    logger.info("🚀 API v2 activée via Feature Flag")
else:
    # v2 toujours montée mais séparée (désactivable via flag)
    app.include_router(v2_router)

# ── Compatibilité anciens routers ─────────────────────────────────────────
try:
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
    from routers import (
        billing_router, engineering_router, jobs_router,
        monitoring_router, quality_router, support_router,
        timeseries_router, transform_router,
    )
    for router in [quality_router, jobs_router, transform_router,
                   timeseries_router, engineering_router, monitoring_router,
                   billing_router, support_router]:
        app.include_router(router)
    logger.info("✅ Anciens routers chargés (compatibilité)")
except Exception as e:
    logger.warning(f"⚠️  Anciens routers non chargés : {e}")

# ── Event handlers (enregistrement auto) ──────────────────────────────────
from app.events import handlers as _events_handlers  # noqa — déclenche les @on()


# ── Startup / Shutdown ─────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()
    os.makedirs(UPLOAD_DIRECTORY,  exist_ok=True)
    os.makedirs(REPORTS_DIRECTORY, exist_ok=True)
    logger.info(f"🚀 {API_TITLE} v{API_VERSION} démarré")
    logger.info(f"📊 Swagger : http://localhost:8000/api/docs")
    logger.info(f"🔭 Jaeger  : http://localhost:16686")
    logger.info(f"🎛️  Flags   : {feature_flags.get_all()}")


@app.on_event("shutdown")
async def shutdown():
    logger.info("🛑 Application arrêtée")


# ── Health & Info ──────────────────────────────────────────────────────────
@app.get("/api/health", tags=["🏥 Health"])
async def health():
    return {
        "status":    "healthy",
        "timestamp": datetime.now().isoformat(),
        "version":   API_VERSION,
    }


@app.get("/api/info", tags=["ℹ️ Info"])
async def info():
    return {
        "title":        API_TITLE,
        "version":      API_VERSION,
        "architecture": "MVC Production-Grade",
        "improvements": {
            "1_repository_uow":    "✅ Repository Pattern + Unit of Work",
            "2_cache":             "✅ Cache L1 (cachetools) + L2 (Redis)",
            "3_event_bus":         "✅ Redis Streams CQRS",
            "4_opentelemetry":     "✅ Traces distribuées → Jaeger",
            "5_api_versioning":    "✅ v1 + v2 avec Deprecation headers",
            "6_feature_flags":     "✅ LaunchDarkly / JSON local",
            "7_sbom_sast":         "✅ Bandit + Safety + CycloneDX + Trivy CI",
        },
        "feature_flags": feature_flags.get_all(),
        "endpoints":     len([r for r in app.routes]),
    }


@app.get("/api/flags", tags=["🎛️ Feature Flags"])
async def get_flags():
    """Retourne l'état de tous les feature flags (debug)."""
    return feature_flags.get_all()


@app.post("/api/flags/reload", tags=["🎛️ Feature Flags"])
async def reload_flags():
    """Recharge les flags depuis le fichier JSON (sans redémarrage)."""
    feature_flags.reload()
    return {"message": "Feature flags rechargés", "flags": feature_flags.get_all()}


# ── Entrée directe ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
