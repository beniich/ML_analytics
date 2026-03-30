"""
DEPENDENCIES — Injection de dépendances FastAPI
(auth, bd, permissions)
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import User
from app.utils.exceptions import UnauthorizedException, ForbiddenException

# Réutilise le système RS256 existant
from auth import verify_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Dependency — retourne l'utilisateur authentifié courant."""
    token   = credentials.credentials
    payload = verify_token(token)

    username   = payload.get("sub")
    token_type = payload.get("type")

    if token_type != "access":
        raise UnauthorizedException("Type de token invalide")
    if not username:
        raise UnauthorizedException("Token invalide")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise UnauthorizedException("Utilisateur introuvable")
    if not user.is_active:
        raise ForbiddenException("Compte inactif")

    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency — vérifie que l'utilisateur est admin."""
    if not current_user.is_admin:
        raise ForbiddenException("Droits administrateur requis")
    return current_user


def get_db_dep():
    """Alias de get_db pour la cohérence nommage."""
    return get_db()
