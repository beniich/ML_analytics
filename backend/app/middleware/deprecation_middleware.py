"""
MIDDLEWARE — Dépréciation API
Ajoute un header Sunset sur les routes v1 dépréciées.
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


# Mapping path_prefix → date de sunset (ISO 8601)
SUNSET_DATES = {
    # Exemple : "/api/v1/auth" se couche le 2026-12-31
    # "/api/v1": "2026-12-31",
}


class DeprecationMiddleware(BaseHTTPMiddleware):
    """
    Injecte le header `Sunset` sur les endpoints dépréciés.
    Conforme à RFC 8594.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        for path_prefix, sunset_date in SUNSET_DATES.items():
            if request.url.path.startswith(path_prefix):
                response.headers["Sunset"]     = sunset_date
                response.headers["Deprecation"] = "true"
                response.headers["Link"]        = (
                    f'</api/v2{request.url.path[len(path_prefix):]}>;'
                    f' rel="successor-version"'
                )
                break

        return response
