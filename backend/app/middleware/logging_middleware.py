"""
MIDDLEWARE — Logging des requêtes HTTP
"""
import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("http")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = round(time.time() - start, 3)
        logger.info(
            f"{request.method} {request.url.path} "
            f"→ {response.status_code} [{duration}s]"
        )
        return response
