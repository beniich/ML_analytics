"""Routes package"""
from .auth_routes     import router as auth_router
from .analysis_routes import router as analysis_router
from .job_routes      import router as job_router
from .v1_router       import v1_router

__all__ = ["auth_router", "analysis_router", "job_router", "v1_router"]
