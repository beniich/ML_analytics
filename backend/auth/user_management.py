from fastapi import HTTPException, status
from ..database.models import User
from sqlalchemy.orm import Session

def create_user(db: Session, username: str, email: str, password: str, is_admin: bool = False):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user = User(username=username, email=email, is_admin=is_admin)
    user.set_password(password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not user.verify_password(password):
        return None
    return user
