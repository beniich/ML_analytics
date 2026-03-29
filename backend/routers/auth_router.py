"""
Advanced Registration & Authentication Router
Handles the 7-step registration flow, TOTP, and token management
"""
import pyotp
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import User, Workspace
from auth import (
    create_access_token,
    create_refresh_token,
    verify_token,
    denylist_jti,
    get_current_user
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication & Registration"])

# Mock OTP cache for email verification (in production this would use Redis)
# To keep this demo simple, we'll store OTPs in memory for the duration of the request
# In reality, you'd do: redis.setex(f"otp:{email}", 300, otp_code)
# Here we just blindly accept "123456" as the universal mock OTP for testing

@router.post("/register")
async def register_step1(
    username: str, 
    email: str, 
    password: str, 
    full_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Step 1: Initial Registration (Password is evaluated via zxcvbn on frontend)"""
    existing_user = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    user = User(
        username=username, 
        email=email, 
        full_name=full_name, 
        is_active=False # Inactive until email verified
    )
    user.set_password(password)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # In a real app we'd trigger a Celery task to send an email with the OTP here
    logger.info(f"Registered user {username}. Mock Email OTP: 123456")
    
    return {"message": "User registered. Please verify your email.", "user_id": user.id}

@router.post("/verify-email")
async def verify_email_step2(email: str, otp: str, db: Session = Depends(get_db)):
    """Step 2: Email Verification"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if otp != "123456": # Mock validation
        raise HTTPException(status_code=400, detail="Invalid OTP code")
        
    user.is_active = True
    db.commit()
    
    # Authenticate user automatically after verification
    access_token = create_access_token(data={"sub": user.username})
    return {"message": "Email verified successfully", "access_token": access_token}

@router.post("/setup-totp")
async def setup_totp_step3(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Step 3: Setup 2FA TOTP. Generates secret and provisioning URI."""
    if current_user.totp_enabled:
        raise HTTPException(status_code=400, detail="TOTP already enabled")
        
    secret = pyotp.random_base32()
    current_user.totp_secret = secret
    db.commit()
    
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=current_user.email, issuer_name="ML Analytics NextGen")
    return {"secret": secret, "provisioning_uri": uri}

@router.post("/verify-totp")
async def verify_totp_step4(code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Step 4: Confirm 2FA TOTP setup"""
    if not current_user.totp_secret:
        raise HTTPException(status_code=400, detail="TOTP not configured")
        
    totp = pyotp.TOTP(current_user.totp_secret)
    if not totp.verify(code):
        raise HTTPException(status_code=400, detail="Invalid TOTP code")
        
    current_user.totp_enabled = True
    db.commit()
    return {"message": "TOTP successfully enabled"}

@router.post("/onboarding/workspace")
async def onboarding_workspace_step5(workspace_name: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Step 5: Create workspace and complete onboarding"""
    # Create the workspace
    new_workspace = Workspace(name=workspace_name)
    db.add(new_workspace)
    db.commit()
    db.refresh(new_workspace)
    
    # Link user to workspace
    current_user.workspace_id = new_workspace.id
    db.commit()
    
    return {"message": "Workspace created and linked", "workspace_id": new_workspace.id, "workspace_name": new_workspace.name}

@router.post("/login")
async def login(username: str, password: str, totp_code: Optional[str] = None, db: Session = Depends(get_db)):
    """Login with 2FA TOTP support"""
    user = db.query(User).filter(User.username == username).first()
    if not user or not user.verify_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User email not verified or inactive")
        
    if user.totp_enabled:
        if not totp_code:
            # Tell frontend that TOTP is required
            return {"totp_required": True, "message": "2FA code required"}
            
        totp = pyotp.TOTP(user.totp_secret)
        if not totp.verify(totp_code):
            raise HTTPException(status_code=401, detail="Invalid 2FA code")

    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "workspace_id": user.workspace_id
        }
    }

@router.post("/refresh")
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token, adds old token to denylist"""
    payload = verify_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
        
    # Denylist the refresh token to prevent reuse (sliding session)
    jti = payload.get("jti")
    exp = payload.get("exp")
    if jti:
        denylist_jti(jti, exp)
        
    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User invalid")
        
    new_access = create_access_token(data={"sub": username})
    new_refresh = create_refresh_token(data={"sub": username})
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}

@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """Logout endpoint, denylists the current access token"""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = verify_token(token)
            jti = payload.get("jti")
            exp = payload.get("exp")
            if jti:
                denylist_jti(jti, exp)
        except Exception:
            pass # Already expired or invalid, nothing to denylist
    return {"message": "Logged out successfully"}
