"""
ROUTES — API v2 (structure préparée)
Même base que v1 — ajout de Sunset header via middleware de dépréciation.
"""
from fastapi import APIRouter

# v2 réutilise les controllers v1 pour l'instant
# Surcharger ici les endpoints qui changent de contrat
from app.routes.auth_routes     import router as auth_router
from app.routes.analysis_routes import router as analysis_router
from app.routes.job_routes      import router as job_router

v2_router = APIRouter(prefix="/api/v2", tags=["🚀 API v2 (beta)"])

# Inclure les routers v1 en v2 (rétrocompatibilité totale)
v2_router.include_router(auth_router,     prefix="")
v2_router.include_router(analysis_router, prefix="")
v2_router.include_router(job_router,      prefix="")


# ── Nouveaux endpoints v2 ──────────────────────────────────────────────────
@v2_router.get("/status", tags=["🚀 API v2 (beta)"])
async def v2_status():
    return {
        "version":   "2.0.0-beta",
        "status":    "active",
        "changelog": [
            "Repository Pattern + Unit of Work",
            "Cache multi-niveaux L1+L2",
            "Event Bus Redis Streams",
            "OpenTelemetry traces",
            "Feature Flags LaunchDarkly",
        ],
        "sunset": None,  # Pas encore planifié
    }
