"""
Routers package - expose all sub-routers
"""
from .quality import router as quality_router
from .jobs import router as jobs_router
from .transform import router as transform_router
from .timeseries import router as timeseries_router
from .engineering import router as engineering_router
from .monitoring import router as monitoring_router
from .billing import router as billing_router
from .support import router as support_router

__all__ = [
    "quality_router",
    "jobs_router",
    "transform_router",
    "timeseries_router",
    "engineering_router",
    "monitoring_router",
    "billing_router",
    "support_router",
]
