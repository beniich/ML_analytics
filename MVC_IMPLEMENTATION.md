# 🛠️ GUIDE D'IMPLÉMENTATION MVC - ML Analytics API

## 📋 Table des Matières
1. [Refactorisation Complète](#refactorisation)
2. [Implémentation Pas à Pas](#implementation)
3. [Fichiers à Créer](#fichiers)
4. [Intégration](#integration)
5. [Tests](#tests)

---

# 1. REFACTORISATION COMPLÈTE <a name="refactorisation"></a>

## Étape 1: Créer la Structure des Dossiers

```bash
#!/bin/bash
# setup_mvc_structure.sh

# Créer la structure MVC
mkdir -p backend/app/{
    models,
    schemas,
    controllers,
    services,
    routes,
    middleware,
    dependencies,
    utils,
    database,
    core,
    tests
}

# Créer les fichiers __init__.py
touch backend/app/__init__.py
touch backend/app/models/__init__.py
touch backend/app/schemas/__init__.py
touch backend/app/controllers/__init__.py
touch backend/app/services/__init__.py
touch backend/app/routes/__init__.py
touch backend/app/middleware/__init__.py
touch backend/app/dependencies/__init__.py
touch backend/app/utils/__init__.py
touch backend/app/database/__init__.py
touch backend/app/core/__init__.py
touch backend/app/tests/__init__.py

echo "✅ Structure MVC créée!"
```

## Étape 2: Migrer les Fichiers Existants

```bash
# Déplacer les fichiers existants dans la structure MVC

# MODELS
mv backend/models.py backend/app/models/
split -l 200 backend/app/models/models.py backend/app/models/

# Renommer les fichiers
mv backend/app/models/models.py backend/app/models/base.py

# CONTRÔLEURS (créer depuis analyzer.py)
# main.py → controllers + routes

# SERVICES
mkdir -p backend/app/services/
# analyzer.py → services/analysis_service.py
# auth.py → services/auth_service.py

# DATABASE
mv backend/database.py backend/app/database/
mv backend/config.py backend/app/

echo "✅ Fichiers migrés!"
```

---

# 2. IMPLÉMENTATION PAS À PAS <a name="implementation"></a>

## Phase 1: Structure de Base

### 1.1 Fichier Principal

```python
# backend/app/main.py - Point d'entrée de l'application

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.routes.v1_router import v1_router
from app.middleware.auth_middleware import AuthMiddleware
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.security_middleware import SecurityMiddleware
from app.middleware.error_middleware import ErrorHandlingMiddleware
from app.database.session import engine, Base

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Créer les tables
Base.metadata.create_all(bind=engine)

# Créer l'application
app = FastAPI(
    title="ML Analytics API",
    version="1.0.0",
    description="API pour l'analyse de données ML"
)

# ========== MIDDLEWARE ==========
# Ordre important: du plus externe au plus interne

# 1. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Gestion des erreurs
app.add_middleware(ErrorHandlingMiddleware)

# 3. Sécurité
app.add_middleware(SecurityMiddleware)

# 4. Logging
app.add_middleware(LoggingMiddleware)

# 5. Authentification
app.add_middleware(AuthMiddleware)

# ========== ROUTEURS ==========
app.include_router(v1_router)

# ========== EVENTS ==========
@app.on_event("startup")
async def startup_event():
    """Événement au démarrage"""
    logger.info("🚀 Application démarrée")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug: {settings.DEBUG}")

@app.on_event("shutdown")
async def shutdown_event():
    """Événement à l'arrêt"""
    logger.info("🛑 Application arrêtée")

# ========== HEALTH CHECK ==========
@app.get("/health", tags=["Health"])
async def health_check():
    """Vérifier la santé de l'API"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/", tags=["Root"])
async def root():
    """Endpoint racine"""
    return {"message": "ML Analytics API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
```

### 1.2 Configuration

```python
# backend/app/config.py

from pydantic_settings import BaseSettings
import os
from typing import List

class Settings(BaseSettings):
    """Configuration globale"""
    
    # Application
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    APP_NAME: str = "ML Analytics API"
    VERSION: str = "1.0.0"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./test.db"
    )
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Logging
    LOG_LEVEL: str = "INFO" if not DEBUG else "DEBUG"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Instance globale
settings = Settings()
```

### 1.3 Session Base de Données

```python
# backend/app/database/session.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings

# Créer le moteur
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args={
        "check_same_thread": False
    } if "sqlite" in settings.DATABASE_URL else {}
)

# Créer la factory de session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base pour les modèles
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

def get_db():
    """Dépendance pour obtenir la session BD"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## Phase 2: Modèles

### 2.1 Organisation des Modèles

```python
# backend/app/models/__init__.py

from .user import User
from .analysis import Analysis
from .report import Report
from .job import Job
from .audit import AuditLog

__all__ = [
    "User",
    "Analysis",
    "Report",
    "Job",
    "AuditLog",
]
```

### 2.2 Modèle User Complet

```python
# backend/app/models/user.py

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    """Modèle utilisateur"""
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Identifiants
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    
    # Mot de passe
    hashed_password = Column(String(255), nullable=False)
    password_changed_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Profil
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    
    # État
    is_active = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # 2FA
    two_factor_enabled = Column(Boolean, default=False)
    totp_secret = Column(String(32), nullable=True)
    
    # Sécurité
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    login_attempts = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="user", cascade="all, delete-orphan")
    
    # Méthodes
    def to_dict(self):
        """Convertir en dictionnaire"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "is_active": self.is_active,
            "is_admin": self.is_admin,
            "created_at": self.created_at,
        }
    
    def is_locked(self) -> bool:
        """Vérifier le verrouillage"""
        if self.locked_until and datetime.utcnow() < self.locked_until:
            return True
        return False
    
    def __repr__(self):
        return f"<User {self.username}>"
```

---

## Phase 3: Schémas (Validation)

### 3.1 Organisation des Schémas

```python
# backend/app/schemas/__init__.py

from .user import UserCreate, UserLogin, UserResponse
from .analysis import AnalysisCreate, AnalysisResponse
from .job import JobCreate, JobResponse

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "AnalysisCreate",
    "AnalysisResponse",
    "JobCreate",
    "JobResponse",
]
```

### 3.2 Schémas Utilisateur

```python
# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """Schéma pour créer un utilisateur"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=12)
    full_name: Optional[str] = None
    
    @validator('username')
    def username_alphanumeric(cls, v):
        assert v.replace('_', '').replace('-', '').isalnum(), \
            'Caractères non autorisés'
        return v

class UserLogin(BaseModel):
    """Schéma pour se connecter"""
    username: str
    password: str

class UserResponse(BaseModel):
    """Schéma de réponse utilisateur"""
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schéma de token"""
    access_token: str
    token_type: str = "bearer"
```

---

## Phase 4: Services

### 4.1 Organisation des Services

```python
# backend/app/services/__init__.py

from .auth_service import AuthService
from .analysis_service import AnalysisService
from .job_service import JobService
from .user_service import UserService

__all__ = [
    "AuthService",
    "AnalysisService",
    "JobService",
    "UserService",
]
```

### 4.2 Service d'Authentification Complet

```python
# backend/app/services/auth_service.py

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from app.models.user import User
from app.utils.password import PasswordManager
from app.utils.jwt_handler import JWTHandler
from app.utils.validators import UserValidator

logger = logging.getLogger(__name__)

class AuthService:
    """Service pour l'authentification"""
    
    def __init__(self, db: Session):
        self.db = db
        self.password_manager = PasswordManager()
        self.jwt_handler = JWTHandler()
        self.validator = UserValidator()
    
    def register_user(
        self,
        username: str,
        email: str,
        password: str,
        full_name: str = None
    ) -> User:
        """Enregistrer un nouvel utilisateur"""
        
        # Validation
        self.validator.validate_username(username)
        self.validator.validate_email(email)
        self.validator.validate_password(password)
        
        # Vérifier l'unicité
        existing_user = self.db.query(User).filter(
            User.username == username
        ).first()
        
        if existing_user:
            raise ValueError(f"Utilisateur {username} déjà utilisé")
        
        existing_email = self.db.query(User).filter(
            User.email == email
        ).first()
        
        if existing_email:
            raise ValueError(f"Email {email} déjà utilisé")
        
        # Créer l'utilisateur
        user = User(
            username=username,
            email=email,
            hashed_password=self.password_manager.hash_password(password),
            full_name=full_name,
            is_active=False
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        logger.info(f"✅ Utilisateur créé: {username}")
        
        return user
    
    def authenticate_user(self, username: str, password: str) -> str:
        """Authentifier un utilisateur"""
        
        user = self.db.query(User).filter(User.username == username).first()
        
        if not user:
            logger.warning(f"❌ Utilisateur non trouvé: {username}")
            raise ValueError("Identifiants invalides")
        
        # Vérifier le verrouillage
        if user.is_locked():
            raise ValueError("Compte verrouillé")
        
        # Vérifier le mot de passe
        if not self.password_manager.verify_password(password, user.hashed_password):
            user.failed_login_attempts += 1
            
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=30)
            
            self.db.commit()
            logger.warning(f"❌ Mot de passe incorrect: {username}")
            raise ValueError("Mot de passe incorrect")
        
        # Authentification réussie
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        # Générer le token
        token = self.jwt_handler.create_access_token(
            data={
                "sub": user.username,
                "user_id": user.id,
                "is_admin": user.is_admin
            }
        )
        
        logger.info(f"✅ Login réussi: {username}")
        
        return token
```

---

## Phase 5: Contrôleurs

### 5.1 Organisation des Contrôleurs

```python
# backend/app/controllers/__init__.py

from .auth_controller import AuthController
from .analysis_controller import AnalysisController
from .job_controller import JobController
from .user_controller import UserController

__all__ = [
    "AuthController",
    "AnalysisController",
    "JobController",
    "UserController",
]
```

### 5.2 Contrôleur d'Authentification Complet

```python
# backend/app/controllers/auth_controller.py

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService

logger = logging.getLogger(__name__)

class AuthController:
    """Contrôleur pour l'authentification"""
    
    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService(db)
    
    async def register(self, user_data: UserCreate) -> dict:
        """Enregistrer un nouvel utilisateur"""
        try:
            user = self.auth_service.register_user(
                username=user_data.username,
                email=user_data.email,
                password=user_data.password,
                full_name=user_data.full_name
            )
            
            return UserResponse.from_orm(user).dict()
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Erreur d'enregistrement: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de l'enregistrement"
            )
    
    async def login(self, credentials: UserLogin) -> Token:
        """Se connecter"""
        try:
            token = self.auth_service.authenticate_user(
                username=credentials.username,
                password=credentials.password
            )
            
            return Token(access_token=token)
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e),
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logger.error(f"Erreur de login: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la connexion"
            )
    
    async def refresh_token(self, current_user) -> Token:
        """Rafraîchir le token"""
        try:
            token = self.auth_service.refresh_access_token(current_user)
            return Token(access_token=token)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
```

---

## Phase 6: Routes

### 6.1 Organisation des Routes

```python
# backend/app/routes/__init__.py

from .auth_routes import router as auth_router
from .analysis_routes import router as analysis_router
from .job_routes import router as job_router
from .user_routes import router as user_router

__all__ = [
    "auth_router",
    "analysis_router",
    "job_router",
    "user_router",
]
```

### 6.2 Routes d'Authentification

```python
# backend/app/routes/auth_routes.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.controllers.auth_controller import AuthController
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.database.session import get_db

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
    responses={404: {"description": "Not found"}}
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enregistrer un nouvel utilisateur"
)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Enregistrer un nouvel utilisateur
    
    - **username**: Nom d'utilisateur unique (3-50 caractères)
    - **email**: Email valide et unique
    - **password**: Mot de passe sécurisé (12+ caractères)
    - **full_name**: Nom complet (optionnel)
    """
    controller = AuthController(db)
    return await controller.register(user_data)

@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Se connecter"
)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Se connecter avec identifiants
    
    - **username**: Nom d'utilisateur
    - **password**: Mot de passe
    
    Retourne un token JWT à utiliser dans Authorization header
    """
    controller = AuthController(db)
    return await controller.login(credentials)

@router.post(
    "/refresh",
    response_model=Token,
    summary="Rafraîchir le token"
)
async def refresh_token(
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)  # A implémenter
):
    """Rafraîchir le token d'accès"""
    controller = AuthController(db)
    return await controller.refresh_token(current_user)
```

### 6.3 Routeur Principal v1

```python
# backend/app/routes/v1_router.py

from fastapi import APIRouter
from app.routes.auth_routes import router as auth_router
from app.routes.analysis_routes import router as analysis_router
from app.routes.job_routes import router as job_router
from app.routes.user_routes import router as user_router

# Créer le routeur principal
v1_router = APIRouter(prefix="/api/v1")

# Inclure les routeurs
v1_router.include_router(auth_router)
v1_router.include_router(analysis_router)
v1_router.include_router(job_router)
v1_router.include_router(user_router)
```

---

# 3. FICHIERS À CRÉER <a name="fichiers"></a>

## Liste Complète

```python
# app/models/
├── __init__.py              ✅ Déjà montré
├── base.py                  # Classe de base BaseModel
├── user.py                  ✅ Déjà montré
├── analysis.py              # Modèle Analysis
├── report.py                # Modèle Report
├── job.py                   # Modèle Job
└── audit.py                 # Modèle AuditLog

# app/schemas/
├── __init__.py              ✅ Déjà montré
├── user.py                  ✅ Déjà montré
├── analysis.py              # Schema Analysis
├── job.py                   # Schema Job
└── common.py                # Schemas communs

# app/controllers/
├── __init__.py              ✅ Déjà montré
├── auth_controller.py       ✅ Déjà montré
├── analysis_controller.py   # Controller Analysis
├── job_controller.py        # Controller Job
└── user_controller.py       # Controller User

# app/services/
├── __init__.py              ✅ Déjà montré
├── auth_service.py          ✅ Déjà montré
├── analysis_service.py      # Service Analysis
├── job_service.py           # Service Job
└── user_service.py          # Service User

# app/routes/
├── __init__.py              ✅ Déjà montré
├── auth_routes.py           ✅ Déjà montré
├── analysis_routes.py       # Routes Analysis
├── job_routes.py            # Routes Job
├── user_routes.py           # Routes User
└── v1_router.py             ✅ Déjà montré

# app/middleware/
├── __init__.py
├── auth_middleware.py       # Authentification
├── logging_middleware.py    # Logging
├── error_middleware.py      # Gestion erreurs
└── security_middleware.py   # Headers sécurité

# app/dependencies/
├── __init__.py
├── auth_deps.py            # Auth dependencies
├── db_deps.py              # BD dependencies
└── permission_deps.py      # Permissions

# app/utils/
├── __init__.py
├── password.py             # Gestion mots de passe
├── jwt_handler.py          # JWT utilities
├── validators.py           # Validateurs
└── exceptions.py           # Exceptions

# app/core/
├── __init__.py
├── analyzer.py             # Analyseur données
├── reporter.py             # Générateur rapports
├── scheduler.py            # Planificateur jobs
└── cache.py                # Cache Redis

# app/database/
├── __init__.py             ✅ Déjà montré
├── session.py              ✅ Déjà montré
└── migrations/             # Alembic

# app/
├── main.py                 ✅ Déjà montré
├── config.py               ✅ Déjà montré
└── __init__.py
```

---

# 4. INTÉGRATION <a name="integration"></a>

## Commandes pour Créer la Structure

```bash
#!/bin/bash
# create_mvc_structure.sh

# Créer les dossiers
mkdir -p backend/app/{models,schemas,controllers,services,routes,middleware,dependencies,utils,core,database}

# Créer les fichiers __init__.py
touch backend/app/__init__.py
touch backend/app/models/__init__.py
touch backend/app/schemas/__init__.py
touch backend/app/controllers/__init__.py
touch backend/app/services/__init__.py
touch backend/app/routes/__init__.py
touch backend/app/middleware/__init__.py
touch backend/app/dependencies/__init__.py
touch backend/app/utils/__init__.py
touch backend/app/core/__init__.py
touch backend/app/database/__init__.py

# Créer les modèles
cat > backend/app/models/base.py << 'EOF'
# Voir le contenu plus haut
EOF

cat > backend/app/models/user.py << 'EOF'
# Voir le contenu plus haut
EOF

# ... etc

echo "✅ Structure MVC créée!"
```

## Exemple de Mise en Place Rapide

```python
# backend/run_migration.py - Créer les tables

from app.database.session import Base, engine
from app.models import User, Analysis, Report, Job, AuditLog

# Créer toutes les tables
Base.metadata.create_all(bind=engine)

print("✅ Tables créées!")
```

---

# 5. TESTS <a name="tests"></a>

## Test d'une Route Complète

```python
# backend/app/tests/test_auth.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.session import Base, get_db

# BD de test
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

class TestAuth:
    """Tests pour l'authentification"""
    
    def test_register_user(self):
        """Test l'enregistrement d'un utilisateur"""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "TestPass123456!",
                "full_name": "Test User"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"
    
    def test_login(self):
        """Test la connexion"""
        # D'abord enregistrer
        client.post(
            "/api/v1/auth/register",
            json={
                "username": "logintest",
                "email": "login@example.com",
                "password": "LoginPass123456!",
            }
        )
        
        # Ensuite essayer de se connecter
        response = client.post(
            "/api/v1/auth/login",
            json={
                "username": "logintest",
                "password": "LoginPass123456!",
            }
        )
        
        assert response.status_code == 200
        assert "access_token" in response.json()
    
    def test_login_with_wrong_password(self):
        """Test la connexion avec mauvais mot de passe"""
        # D'abord enregistrer
        client.post(
            "/api/v1/auth/register",
            json={
                "username": "wrongpass",
                "email": "wrong@example.com",
                "password": "WrongPass123456!",
            }
        )
        
        # Essayer de se connecter avec mauvais mot de passe
        response = client.post(
            "/api/v1/auth/login",
            json={
                "username": "wrongpass",
                "password": "BadPassword!",
            }
        )
        
        assert response.status_code == 401
```

## Exécuter les Tests

```bash
# Installer pytest
pip install pytest pytest-asyncio

# Exécuter les tests
pytest backend/app/tests/ -v

# Avec couverture
pytest backend/app/tests/ --cov=app --cov-report=html
```

---

## 🎯 Résumé d'Implémentation

| Étape | Fichier | Status |
|-------|---------|--------|
| 1 | main.py | ✅ Montré |
| 2 | config.py | ✅ Montré |
| 3 | database/session.py | ✅ Montré |
| 4 | models/user.py | ✅ Montré |
| 5 | schemas/user.py | ✅ Montré |
| 6 | services/auth_service.py | ✅ Montré |
| 7 | controllers/auth_controller.py | ✅ Montré |
| 8 | routes/auth_routes.py | ✅ Montré |
| 9 | routes/v1_router.py | ✅ Montré |
| 10 | middleware/* | À créer |
| 11 | dependencies/* | À créer |
| 12 | utils/* | À créer |
| 13 | tests/* | ✅ Montré |

**Tous les fichiers principaux sont maintenant documentés!**

🚀 **Prêt pour la refactorisation MVC complète!**
