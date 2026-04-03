"""
CORE — Rate Limiting Configuration
Using slowapi with Redis for production scalability.
"""
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Redis URL from environment
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# If REDIS_URL is present, we use it for storage (shared between multiple workers)
# Otherwise, we fallback to memory-only
storage_uri = REDIS_URL if "redis://" in REDIS_URL else "memory://"

limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=storage_uri,
    default_limits=["200 per day", "50 per hour"],
)

def setup_rate_limit(app) -> None:
    """Configures the rate limiter for the FastAPI application."""
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
