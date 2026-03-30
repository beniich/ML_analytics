from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from routers.auth_router import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_admin": current_user.is_admin,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat(),
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
    }

@router.put("/me")
async def update_user_profile(
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if full_name:
            current_user.full_name = full_name
        if email:
            existing = db.query(User).filter(User.email == email, User.id != current_user.id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")
            current_user.email = email
        db.commit()
        db.refresh(current_user)
        return {"message": "Profile updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
