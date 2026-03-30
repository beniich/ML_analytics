"""
SERVICE — Authentification
Logique métier pour l'inscription, connexion, token
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..'))

import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models import User
from app.schemas import UserCreate, Token
from app.utils.exceptions import ConflictException, UnauthorizedException, ForbiddenException
from auth import create_access_token, create_refresh_token, denylist_jti, verify_token

logger = logging.getLogger(__name__)


class AuthService:
    """Gère l'inscription, la connexion et les tokens JWT."""

    def __init__(self, db: Session):
        self.db = db

    # ── Register ───────────────────────────────────────────────────────────
    def register_user(self, data: UserCreate) -> User:
        if self.db.query(User).filter(User.username == data.username).first():
            raise ConflictException(f"Nom d'utilisateur '{data.username}' déjà utilisé")
        if self.db.query(User).filter(User.email == data.email).first():
            raise ConflictException(f"Email '{data.email}' déjà utilisé")

        user = User(
            username=data.username,
            email=data.email,
            full_name=data.full_name,
            is_active=True,
        )
        user.set_password(data.password)

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        logger.info(f"✅ Utilisateur créé : {user.username}")
        return user

    # ── Login ──────────────────────────────────────────────────────────────
    def authenticate(self, username: str, password: str) -> Token:
        user = self.db.query(User).filter(User.username == username).first()

        if not user:
            raise UnauthorizedException("Identifiants invalides")

        if user.is_locked():
            raise ForbiddenException("Compte verrouillé — réessayez dans 30 minutes")

        if not user.verify_password(password):
            user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=30)
                logger.warning(f"🔒 Compte verrouillé : {username}")
            self.db.commit()
            raise UnauthorizedException("Identifiants invalides")

        # Succès
        user.failed_login_attempts = 0
        user.locked_until           = None
        user.last_login             = datetime.utcnow()
        self.db.commit()

        payload        = {"sub": user.username, "user_id": user.id, "is_admin": user.is_admin}
        access_token   = create_access_token(payload)
        refresh_token  = create_refresh_token(payload)

        logger.info(f"✅ Login réussi : {username}")
        return Token(access_token=access_token, refresh_token=refresh_token)

    # ── Refresh ────────────────────────────────────────────────────────────
    def refresh_token(self, refresh_token_str: str) -> Token:
        payload = verify_token(refresh_token_str)
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Token de rafraîchissement invalide")

        username = payload.get("sub")
        user     = self.db.query(User).filter(User.username == username).first()
        if not user or not user.is_active:
            raise UnauthorizedException("Utilisateur introuvable ou inactif")

        new_payload   = {"sub": user.username, "user_id": user.id, "is_admin": user.is_admin}
        access_token  = create_access_token(new_payload)
        return Token(access_token=access_token, refresh_token=refresh_token_str)

    # ── Logout ─────────────────────────────────────────────────────────────
    def logout(self, token_str: str) -> None:
        payload = verify_token(token_str)
        jti     = payload.get("jti")
        exp     = payload.get("exp", 0)
        if jti:
            denylist_jti(jti, exp)
        logger.info(f"🚪 Logout : {payload.get('sub')}")
