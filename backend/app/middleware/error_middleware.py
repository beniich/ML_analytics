"""
MIDDLEWARE — Gestion globale des erreurs
"""
import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class ErrorMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            logger.exception(f"Erreur non gérée sur {request.method} {request.url.path}")
            return JSONResponse(
                status_code=500,
                content={"detail": "Erreur interne du serveur", "path": str(request.url.path)},
            )
