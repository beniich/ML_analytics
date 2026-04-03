"""
ROUTES — Authentification  /api/v1/auth
"""
from fastapi import APIRouter, Depends, Body, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.controllers import AuthController
from app.schemas     import UserCreate, UserLogin, UserResponse, Token, MessageResponse
from app.database    import get_db
from app.models      import User
from app.dependencies import get_current_user
from app.core.rate_limit import limiter
from fastapi import Request

router  = APIRouter(prefix="/api/v1/auth", tags=["🔐 Authentication"])
_bearer = HTTPBearer()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un compte utilisateur",
)
@limiter.limit("5/minute")
async def register(request: Request, data: UserCreate, db: Session = Depends(get_db)):
    return await AuthController(db).register(data)


@router.post("/login", response_model=Token, summary="Se connecter")
@limiter.limit("10/minute")
async def login(request: Request, data: UserLogin, db: Session = Depends(get_db)):
    return await AuthController(db).login(data)


@router.post("/refresh", response_model=Token, summary="Rafraîchir le token")
async def refresh(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
):
    return await AuthController(db).refresh(credentials.credentials)


@router.post("/logout", response_model=MessageResponse, summary="Se déconnecter")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
):
    return await AuthController(db).logout(credentials.credentials)


@router.get("/me", response_model=UserResponse, summary="Profil courant")
async def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return await AuthController(db).me(current_user)
