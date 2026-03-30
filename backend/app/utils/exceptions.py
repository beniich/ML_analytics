"""
UTILS — Exceptions personnalisées
"""
from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Ressource introuvable"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Non autorisé"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "Accès refusé"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ValidationException(HTTPException):
    def __init__(self, detail: str = "Données invalides"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)


class ConflictException(HTTPException):
    def __init__(self, detail: str = "Conflit de données"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
