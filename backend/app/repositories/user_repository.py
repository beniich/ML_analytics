"""
REPOSITORY — User
"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models import User
from .base_repository import BaseRepository


class UserRepository(BaseRepository[User]):

    def __init__(self, db: Session):
        super().__init__(User, db)

    def find_by_username(self, username: str) -> Optional[User]:
        return self.find_one(username=username)

    def find_by_email(self, email: str) -> Optional[User]:
        return self.find_one(email=email)

    def username_exists(self, username: str) -> bool:
        return self.exists(username=username)

    def email_exists(self, email: str) -> bool:
        return self.exists(email=email)

    def get_active_users(self) -> list:
        return self.filter_by(is_active=True)
