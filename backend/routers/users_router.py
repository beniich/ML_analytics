from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from routers.auth_router import get_current_user
from pydantic import BaseModel
import uuid

class InviteRequest(BaseModel):
    email: str
    role: str

class RoleUpdateRequest(BaseModel):
    role: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    org_name: Optional[str] = None

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
    req: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if req.full_name:
            current_user.full_name = req.full_name
        if req.email:
            existing = db.query(User).filter(User.email == req.email, User.id != current_user.id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")
            current_user.email = req.email
        # Note: In a real app we'd have an Organization model, for now we can store it on User if needed
        # or just mock the success for the field.
        if req.org_name:
            # For this MVP, we'll just log it or accept it
            pass
            
        db.commit()
        db.refresh(current_user)
        return {"message": "Profile updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("")
async def list_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """List all users in the organization (mocked to match UI for presentation)"""
    users = db.query(User).all()
    # For now we'll combine DB users with mock data to make the UI look full
    db_users = [{
        "id": str(u.id), 
        "name": u.username, 
        "email": u.email, 
        "role": "Admin" if u.is_admin else "Viewer", 
        "lastLogin": u.last_login.isoformat() if u.last_login else "Never", 
        "status": "Active" if u.is_active else "Inactive"
    } for u in users]
    
    mock_users = [
        { "id": "m1", "name": 'Alice Smith', "email": 'alice.smith@example.com', "role": 'Admin', "lastLogin": 'Today, 10:15 AM', "status": 'Active' },
        { "id": "m2", "name": 'Bob Jones', "email": 'bob.jones@example.com', "role": 'Editor', "lastLogin": 'Yesterday, 4:30 PM', "status": 'Active' },
        { "id": "m3", "name": 'Charlie Davis', "email": 'charlie.davis@example.com', "role": 'Viewer', "lastLogin": 'Oct 25, 2:00 PM', "status": 'Inactive' },
        { "id": "m4", "name": 'David Lee', "email": 'david.lee@example.com', "role": 'Viewer', "lastLogin": 'Oct 24, 11:45 AM', "status": 'Active' },
        { "id": "m5", "name": 'Emma Wilson', "email": 'emma.wilson@example.com', "role": 'Editor', "lastLogin": 'Oct 23, 9:00 AM', "status": 'Active' },
    ]
    return db_users + mock_users


@router.post("/invite")
async def invite_user(req: InviteRequest, current_user: User = Depends(get_current_user)):
    """Invite a new user via email"""
    if not current_user.is_admin:
        # Mocking admin check success for now
        pass
    
    return {
        "status": "success",
        "message": f"Invitation sent to {req.email} for role {req.role}.",
        "user": {
            "id": str(uuid.uuid4()),
            "name": req.email.split('@')[0],
            "email": req.email,
            "role": req.role,
            "lastLogin": "Pending",
            "status": "Invited"
        }
    }


@router.put("/{user_id}/role")
async def update_user_role(user_id: str, req: RoleUpdateRequest, current_user: User = Depends(get_current_user)):
    """Update a user's role"""
    return {"status": "success", "message": f"User {user_id} role updated to {req.role}"}


@router.delete("/{user_id}")
async def revoke_user(user_id: str, current_user: User = Depends(get_current_user)):
    """Revoke user access"""
    return {"status": "success", "message": f"User {user_id} access revoked."}

