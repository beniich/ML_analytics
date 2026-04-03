"""
ROUTEUR principal v1 — agrège toutes les routes
"""
from fastapi import APIRouter

from app.routes.auth_routes     import router as auth_router
from app.routes.analysis_routes import router as analysis_router
from app.routes.job_routes      import router as job_router
from app.routes.ai_routes       import router as ai_router

v1_router = APIRouter()

v1_router.include_router(auth_router)
v1_router.include_router(analysis_router)
v1_router.include_router(job_router)
v1_router.include_router(ai_router)
