"""
MIDDLEWARE — Protection de la mémoire (Upload Limits)
Bloque les payloads trop volumineux avant qu'ils n'arrivent aux contrôleurs.
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

# Max upload size: 100MB (Ajustable selon besoins ML)
MAX_FILE_SIZE = 100 * 1024 * 1024 

class UploadLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "POST":
            content_length = request.headers.get("content-length")
            if content_length:
                if int(content_length) > MAX_FILE_SIZE:
                    logger.warning(f"🚨 Payload too large: {content_length} bytes from {request.client.host}")
                    raise HTTPException(
                        status_code=413, 
                        detail=f"Fichier trop volumineux. Limite autorisée : {MAX_FILE_SIZE // (1024*1024)}MB."
                    )
        
        return await call_next(request)
