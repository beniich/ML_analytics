"""
CONTROLLER — Authentification
Reçoit les requêtes HTTP, appelle AuthService, formate les réponses
"""
import logging
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas  import UserCreate, UserLogin, UserResponse, Token, MessageResponse
from app.services import AuthService
from app.services.audit_service import audit_service
from app.models   import User

logger = logging.getLogger(__name__)


class AuthController:

    def __init__(self, db: Session):
        self.service = AuthService(db)

    async def register(self, data: UserCreate) -> UserResponse:
        user = self.service.register_user(data)
        return UserResponse.model_validate(user)

    async def login(self, data: UserLogin) -> Token:
        token = self.service.authenticate(data.username, data.password)
        # Log audit (Action critique réussie)
        audit_service.log_action(user_id=0, username=data.username, action="USER_LOGIN", details="Connexion réussie")
        return token

    async def refresh(self, refresh_token: str) -> Token:
        return self.service.refresh_token(refresh_token)

    async def logout(self, token: str) -> MessageResponse:
        self.service.logout(token)
        audit_service.log_action(user_id=0, username="current_user", action="USER_LOGOUT")
        return MessageResponse(message="Déconnecté avec succès")

    async def me(self, current_user: User) -> UserResponse:
        return UserResponse.model_validate(current_user)
