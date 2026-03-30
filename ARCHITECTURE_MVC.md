# 🏗️ ARCHITECTURE MVC - ML Analytics API

## 📋 Table des Matières
1. [Vue d'Ensemble MVC](#vue-ensemble)
2. [Structure des Dossiers](#structure)
3. [Modèles](#modeles)
4. [Contrôleurs](#controleurs)
5. [Services](#services)
6. [Routes](#routes)
7. [Middleware](#middleware)
8. [Exemple Complet](#exemple)

---

# 1. VUE D'ENSEMBLE MVC <a name="vue-ensemble"></a>

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT (Frontend)                  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│               ROUTER / ROUTES                       │
│  (Mappe les URLs aux Contrôleurs)                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            MIDDLEWARE & VALIDATION                  │
│  (Authentification, autorisation, validation)      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              CONTROLLER (Contrôleur)               │
│  - Reçoit la requête                               │
│  - Valide les paramètres                           │
│  - Appelle le SERVICE                              │
│  - Formate la réponse                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              SERVICE (Logique Métier)              │
│  - Logique complexe                                │
│  - Appelle le MODEL                                │
│  - Transactions                                     │
│  - Validations métier                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              MODEL (Modèle de Données)             │
│  - Représente les données                          │
│  - ORM SQLAlchemy                                  │
│  - Validations BD                                  │
│  - Migrations                                      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│           DATABASE (PostgreSQL)                     │
│  - Stockage persistant                             │
└─────────────────────────────────────────────────────┘
```

---

# 2. STRUCTURE DES DOSSIERS <a name="structure"></a>

```
ml_analytics_api/
│
├── backend/
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # Application FastAPI
│   │   ├── config.py              # Configuration
│   │   │
│   │   ├── models/                # MODÈLES
│   │   │   ├── __init__.py
│   │   │   ├── base.py            # Classe de base
│   │   │   ├── user.py            # Modèle User
│   │   │   ├── analysis.py        # Modèle Analysis
│   │   │   ├── report.py          # Modèle Report
│   │   │   ├── job.py             # Modèle Job
│   │   │   └── audit.py           # Modèle Audit
│   │   │
│   │   ├── schemas/               # SCHÉMAS (Validation)
│   │   │   ├── __init__.py
│   │   │   ├── user.py            # Schema User
│   │   │   ├── analysis.py        # Schema Analysis
│   │   │   └── job.py             # Schema Job
│   │   │
│   │   ├── controllers/           # CONTRÔLEURS
│   │   │   ├── __init__.py
│   │   │   ├── auth_controller.py      # Authentification
│   │   │   ├── analysis_controller.py  # Analyses
│   │   │   ├── report_controller.py    # Rapports
│   │   │   ├── job_controller.py       # Jobs
│   │   │   └── user_controller.py      # Utilisateurs
│   │   │
│   │   ├── services/              # SERVICES (Logique Métier)
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py         # Service Auth
│   │   │   ├── analysis_service.py     # Service Analyses
│   │   │   ├── report_service.py       # Service Rapports
│   │   │   ├── job_service.py          # Service Jobs
│   │   │   └── user_service.py         # Service Utilisateurs
│   │   │
│   │   ├── routes/                # ROUTES / API ENDPOINTS
│   │   │   ├── __init__.py
│   │   │   ├── auth_routes.py          # Routes Auth
│   │   │   ├── analysis_routes.py      # Routes Analyses
│   │   │   ├── report_routes.py        # Routes Rapports
│   │   │   ├── job_routes.py           # Routes Jobs
│   │   │   ├── user_routes.py          # Routes Utilisateurs
│   │   │   └── v1_router.py            # Routeur principal v1
│   │   │
│   │   ├── middleware/            # MIDDLEWARE
│   │   │   ├── __init__.py
│   │   │   ├── auth_middleware.py      # Authentification
│   │   │   ├── logging_middleware.py   # Logging
│   │   │   ├── error_middleware.py     # Gestion erreurs
│   │   │   └── security_middleware.py  # Sécurité
│   │   │
│   │   ├── dependencies/          # DÉPENDANCES (Injection)
│   │   │   ├── __init__.py
│   │   │   ├── auth_deps.py       # Auth dependencies
│   │   │   ├── db_deps.py         # BD dependencies
│   │   │   └── permission_deps.py # Permission dependencies
│   │   │
│   │   ├── utils/                 # UTILITAIRES
│   │   │   ├── __init__.py
│   │   │   ├── password.py        # Gestion mots de passe
│   │   │   ├── jwt_handler.py     # JWT utilities
│   │   │   ├── validators.py      # Validateurs
│   │   │   └── exceptions.py      # Exceptions personnalisées
│   │   │
│   │   ├── database/              # BASE DE DONNÉES
│   │   │   ├── __init__.py
│   │   │   ├── session.py         # Session BD
│   │   │   ├── connection.py      # Connexion BD
│   │   │   └── migrations/        # Alembic migrations
│   │   │
│   │   └── core/                  # LOGIQUE CORE
│   │       ├── __init__.py
│   │       ├── analyzer.py        # Analyseur données
│   │       ├── reporter.py        # Générateur rapports
│   │       ├── scheduler.py       # Planificateur jobs
│   │       └── cache.py           # Cache Redis
│   │
│   ├── tests/                     # TESTS
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_analysis.py
│   │   └── conftest.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
└── docker-compose.yml
```

---

# 3. MODÈLES <a name="modeles"></a>

## 3.1 Classe de Base pour les Modèles

```python
# app/models/base.py

from datetime import datetime
from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column

Base = declarative_base()

class BaseModel(Base):
    """Classe de base pour tous les modèles"""
    __abstract__ = True
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    def to_dict(self):
        """Convertir le modèle en dictionnaire"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
```

## 3.2 Modèle User

```python
# app/models/user.py

from sqlalchemy import Column, String, Boolean, Integer, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from .base import BaseModel

class User(BaseModel):
    """Modèle utilisateur"""
    __tablename__ = "users"
    
    # Identifiant
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    
    # Mot de passe
    hashed_password = Column(String(255), nullable=False)
    password_changed_at = Column(DateTime(timezone=True))
    
    # Profil
    full_name = Column(String(100))
    avatar_url = Column(String(255))
    
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
    
    # Relations
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    
    def is_locked(self) -> bool:
        """Vérifier si le compte est verrouillé"""
        if self.locked_until and datetime.utcnow() < self.locked_until:
            return True
        return False
    
    def unlock(self):
        """Déverrouiller le compte"""
        self.locked_until = None
        self.failed_login_attempts = 0
```

## 3.3 Modèle Analysis

```python
# app/models/analysis.py

from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Analysis(BaseModel):
    """Modèle d'analyse"""
    __tablename__ = "analyses"
    
    # Référence
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Données
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(10))  # csv, xlsx, json, etc.
    file_size = Column(Integer)  # en bytes
    
    # Résultats
    analysis_type = Column(String(50))  # basic, comprehensive, etc.
    results = Column(JSON)  # Résultats en JSON
    
    # Sécurité
    is_public = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # Métadonnées
    execution_time_seconds = Column(Integer)
    rows_analyzed = Column(Integer)
    columns_analyzed = Column(Integer)
    
    # Relations
    user = relationship("User", back_populates="analyses")
    reports = relationship("Report", back_populates="analysis")
```

## 3.4 Modèle Report

```python
# app/models/report.py

from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Report(BaseModel):
    """Modèle de rapport"""
    __tablename__ = "reports"
    
    # Référence
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=True)
    
    # Contenu
    report_name = Column(String(255), nullable=False)
    report_type = Column(String(50))  # html, pdf, json
    content = Column(JSON)
    
    # Fichier
    file_path = Column(String(500))
    file_size = Column(Integer)
    
    # Tags
    tags = Column(JSON, default=list)
    
    # Relations
    user = relationship("User", back_populates="reports")
    analysis = relationship("Analysis", back_populates="reports")
```

## 3.5 Modèle Job (Planification)

```python
# app/models/job.py

from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .base import BaseModel

class JobStatus(str, enum.Enum):
    """Statuts possibles d'un job"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Job(BaseModel):
    """Modèle de job planifié"""
    __tablename__ = "jobs"
    
    # Référence
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Configuration
    job_name = Column(String(255), nullable=False)
    job_type = Column(String(50))  # analysis, export, report
    frequency = Column(String(20))  # once, daily, weekly, monthly
    
    # État
    status = Column(String(20), default=JobStatus.PENDING)
    
    # Planification
    next_run = Column(DateTime(timezone=True))
    last_run = Column(DateTime(timezone=True), nullable=True)
    
    # Configuration du job
    config = Column(JSON)  # Paramètres du job
    
    # Résultats
    last_result = Column(JSON)
    last_error = Column(String(500))
    
    # Statistiques
    total_runs = Column(Integer, default=0)
    successful_runs = Column(Integer, default=0)
    failed_runs = Column(Integer, default=0)
    
    # Contrôle
    is_active = Column(Boolean, default=True)
    max_retries = Column(Integer, default=3)
    current_retry = Column(Integer, default=0)
```

---

# 4. CONTRÔLEURS <a name="controleurs"></a>

## 4.1 Contrôleur d'Authentification

```python
# app/controllers/auth_controller.py

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.schemas.user import UserCreate, UserLogin, Token
from app.services.auth_service import AuthService
from app.database.session import get_db
from app.dependencies.auth_deps import get_current_user

logger = logging.getLogger(__name__)

class AuthController:
    """Contrôleur pour l'authentification"""
    
    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService(db)
    
    async def register(self, user_data: UserCreate) -> dict:
        """
        Enregistrer un nouvel utilisateur
        
        Args:
            user_data: Données du nouvel utilisateur
        
        Returns:
            Utilisateur créé
        
        Raises:
            HTTPException: Si l'utilisateur existe déjà
        """
        try:
            user = self.auth_service.register_user(
                username=user_data.username,
                email=user_data.email,
                password=user_data.password,
                full_name=user_data.full_name
            )
            
            logger.info(f"Utilisateur enregistré: {user.username}")
            
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "message": "Utilisateur créé. Vérifiez votre email."
            }
        
        except ValueError as e:
            logger.warning(f"Erreur d'enregistrement: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def login(self, credentials: UserLogin) -> dict:
        """
        Se connecter avec identifiants
        
        Args:
            credentials: Nom d'utilisateur et mot de passe
        
        Returns:
            Token JWT
        
        Raises:
            HTTPException: Si identifiants invalides
        """
        try:
            token = self.auth_service.authenticate_user(
                username=credentials.username,
                password=credentials.password
            )
            
            logger.info(f"Login réussi: {credentials.username}")
            
            return {
                "access_token": token,
                "token_type": "bearer"
            }
        
        except ValueError as e:
            logger.warning(f"Login échoué: {str(e)}")
            raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    async def refresh_token(self, current_user = Depends(get_current_user)) -> dict:
        """Rafraîchir le token"""
        new_token = self.auth_service.refresh_access_token(current_user)
        return {"access_token": new_token}
    
    async def logout(self, current_user = Depends(get_current_user)) -> dict:
        """Se déconnecter"""
        self.auth_service.logout_user(current_user.id)
        return {"message": "Déconnecté avec succès"}
```

## 4.2 Contrôleur d'Analyses

```python
# app/controllers/analysis_controller.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
import logging

from app.services.analysis_service import AnalysisService
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.database.session import get_db
from app.dependencies.auth_deps import get_current_user

logger = logging.getLogger(__name__)

class AnalysisController:
    """Contrôleur pour les analyses"""
    
    def __init__(self, db: Session):
        self.db = db
        self.analysis_service = AnalysisService(db)
    
    async def basic_analysis(
        self,
        file: UploadFile = File(...),
        current_user = Depends(get_current_user)
    ) -> AnalysisResponse:
        """
        Effectuer une analyse basique
        
        Args:
            file: Fichier à analyser
            current_user: Utilisateur authentifié
        
        Returns:
            Résultats de l'analyse
        """
        try:
            # Valider le fichier
            self.analysis_service.validate_file(file)
            
            # Traiter le fichier
            df = await self.analysis_service.load_file(file)
            
            # Effectuer l'analyse
            results = self.analysis_service.analyze_basic(df)
            
            # Sauvegarder les résultats
            analysis = self.analysis_service.save_analysis(
                user_id=current_user.id,
                file_name=file.filename,
                analysis_type="basic",
                results=results
            )
            
            logger.info(f"Analyse basique complétée: {analysis.id}")
            
            return AnalysisResponse(
                id=analysis.id,
                file_name=analysis.file_name,
                analysis_type=analysis.analysis_type,
                results=analysis.results
            )
        
        except Exception as e:
            logger.error(f"Erreur d'analyse: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def comprehensive_analysis(
        self,
        file: UploadFile = File(...),
        include_predictions: bool = True,
        current_user = Depends(get_current_user)
    ) -> AnalysisResponse:
        """Analyse complète avec prédictions"""
        # Même structure que basic_analysis
        # Mais appelle analysis_service.analyze_comprehensive()
        pass
    
    async def get_analysis(
        self,
        analysis_id: int,
        current_user = Depends(get_current_user)
    ) -> AnalysisResponse:
        """Obtenir une analyse existante"""
        analysis = self.analysis_service.get_analysis(analysis_id)
        
        # Vérifier les permissions
        if analysis.user_id != current_user.id and not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Pas d'accès")
        
        return AnalysisResponse(**analysis.to_dict())
```

## 4.3 Contrôleur de Jobs

```python
# app/controllers/job_controller.py

from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.job_service import JobService
from app.schemas.job import JobCreate, JobResponse
from app.database.session import get_db
from app.dependencies.auth_deps import get_current_user

logger = logging.getLogger(__name__)

class JobController:
    """Contrôleur pour les jobs planifiés"""
    
    def __init__(self, db: Session):
        self.db = db
        self.job_service = JobService(db)
    
    async def schedule_analysis(
        self,
        job_data: JobCreate,
        current_user = Depends(get_current_user)
    ) -> JobResponse:
        """
        Planifier une analyse récurrente
        
        Args:
            job_data: Configuration du job
            current_user: Utilisateur authentifié
        
        Returns:
            Job créé
        """
        try:
            job = self.job_service.create_job(
                user_id=current_user.id,
                job_name=job_data.job_name,
                job_type=job_data.job_type,
                frequency=job_data.frequency,
                config=job_data.config
            )
            
            logger.info(f"Job planifié: {job.id}")
            
            return JobResponse(**job.to_dict())
        
        except Exception as e:
            logger.error(f"Erreur création job: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def list_jobs(
        self,
        current_user = Depends(get_current_user)
    ) -> List[JobResponse]:
        """Lister tous les jobs de l'utilisateur"""
        jobs = self.job_service.get_user_jobs(current_user.id)
        return [JobResponse(**job.to_dict()) for job in jobs]
    
    async def get_job(
        self,
        job_id: int,
        current_user = Depends(get_current_user)
    ) -> JobResponse:
        """Obtenir un job"""
        job = self.job_service.get_job(job_id)
        
        # Vérifier les permissions
        if job.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Pas d'accès")
        
        return JobResponse(**job.to_dict())
    
    async def pause_job(
        self,
        job_id: int,
        current_user = Depends(get_current_user)
    ) -> dict:
        """Mettre en pause un job"""
        job = self.job_service.get_job(job_id)
        
        if job.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Pas d'accès")
        
        self.job_service.pause_job(job_id)
        return {"message": "Job mis en pause"}
    
    async def resume_job(
        self,
        job_id: int,
        current_user = Depends(get_current_user)
    ) -> dict:
        """Reprendre un job"""
        job = self.job_service.get_job(job_id)
        
        if job.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Pas d'accès")
        
        self.job_service.resume_job(job_id)
        return {"message": "Job repris"}
    
    async def delete_job(
        self,
        job_id: int,
        current_user = Depends(get_current_user)
    ) -> dict:
        """Supprimer un job"""
        job = self.job_service.get_job(job_id)
        
        if job.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Pas d'accès")
        
        self.job_service.delete_job(job_id)
        return {"message": "Job supprimé"}
```

---

# 5. SERVICES <a name="services"></a>

## 5.1 Service d'Authentification

```python
# app/services/auth_service.py

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
        """
        Enregistrer un nouvel utilisateur
        
        Args:
            username: Nom d'utilisateur
            email: Email
            password: Mot de passe
            full_name: Nom complet
        
        Returns:
            Utilisateur créé
        
        Raises:
            ValueError: Si validation échoue
        """
        # Valider les entrées
        self.validator.validate_username(username)
        self.validator.validate_email(email)
        self.validator.validate_password(password)
        
        # Vérifier l'unicité
        if self.db.query(User).filter(User.username == username).first():
            raise ValueError("Nom d'utilisateur déjà utilisé")
        
        if self.db.query(User).filter(User.email == email).first():
            raise ValueError("Email déjà utilisé")
        
        # Créer l'utilisateur
        user = User(
            username=username,
            email=email,
            hashed_password=self.password_manager.hash_password(password),
            full_name=full_name,
            is_active=False  # Nécessite vérification email
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        logger.info(f"Utilisateur créé: {username}")
        
        return user
    
    def authenticate_user(self, username: str, password: str) -> str:
        """
        Authentifier un utilisateur
        
        Args:
            username: Nom d'utilisateur
            password: Mot de passe
        
        Returns:
            Token JWT
        
        Raises:
            ValueError: Si authentification échoue
        """
        # Chercher l'utilisateur
        user = self.db.query(User).filter(User.username == username).first()
        
        if not user:
            raise ValueError("Utilisateur non trouvé")
        
        # Vérifier le verrouillage
        if user.is_locked():
            raise ValueError("Compte verrouillé")
        
        # Vérifier le mot de passe
        if not self.password_manager.verify_password(password, user.hashed_password):
            user.failed_login_attempts += 1
            
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=30)
            
            self.db.commit()
            raise ValueError("Mot de passe incorrect")
        
        # Authentification réussie
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        # Générer le token
        token = self.jwt_handler.create_access_token(
            data={"sub": user.username, "user_id": user.id}
        )
        
        logger.info(f"Authentification réussie: {username}")
        
        return token
    
    def refresh_access_token(self, user: User) -> str:
        """Rafraîchir le token d'accès"""
        token = self.jwt_handler.create_access_token(
            data={"sub": user.username, "user_id": user.id}
        )
        return token
    
    def logout_user(self, user_id: int):
        """Déconnecter un utilisateur"""
        # Ajouter le token à la blacklist si nécessaire
        logger.info(f"Déconnexion: {user_id}")
```

## 5.2 Service d'Analyses

```python
# app/services/analysis_service.py

from sqlalchemy.orm import Session
import pandas as pd
from typing import Optional, Dict, Any
import logging

from app.models.analysis import Analysis
from app.core.analyzer import DataAnalyzer

logger = logging.getLogger(__name__)

class AnalysisService:
    """Service pour les analyses de données"""
    
    def __init__(self, db: Session):
        self.db = db
        self.analyzer = DataAnalyzer()
    
    async def load_file(self, file) -> pd.DataFrame:
        """
        Charger un fichier
        
        Args:
            file: Fichier uploadé
        
        Returns:
            DataFrame pandas
        """
        # Lire le contenu
        content = await file.read()
        
        # Charger selon le type
        if file.filename.endswith('.csv'):
            df = pd.read_csv(content)
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(content)
        elif file.filename.endswith('.json'):
            df = pd.read_json(content)
        else:
            raise ValueError("Format de fichier non supporté")
        
        return df
    
    def validate_file(self, file):
        """Valider un fichier"""
        # Vérifier la taille
        if file.size > 52428800:  # 50MB
            raise ValueError("Fichier trop volumineux")
        
        # Vérifier le type
        allowed = ['.csv', '.xlsx', '.json', '.parquet']
        if not any(file.filename.endswith(ext) for ext in allowed):
            raise ValueError("Type de fichier non autorisé")
    
    def analyze_basic(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Effectuer une analyse basique"""
        results = {
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "dtypes": str(df.dtypes.to_dict()),
            "missing_values": df.isnull().sum().to_dict(),
            "describe": df.describe().to_dict()
        }
        return results
    
    def analyze_comprehensive(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Effectuer une analyse complète"""
        # Utiliser le service d'analyse complet
        results = self.analyzer.complete_analysis(df)
        return results
    
    def save_analysis(
        self,
        user_id: int,
        file_name: str,
        analysis_type: str,
        results: Dict[str, Any]
    ) -> Analysis:
        """Sauvegarder les résultats d'analyse"""
        analysis = Analysis(
            user_id=user_id,
            file_name=file_name,
            analysis_type=analysis_type,
            results=results
        )
        
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        logger.info(f"Analyse sauvegardée: {analysis.id}")
        
        return analysis
    
    def get_analysis(self, analysis_id: int) -> Analysis:
        """Obtenir une analyse"""
        analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        
        if not analysis:
            raise ValueError("Analyse non trouvée")
        
        return analysis
```

## 5.3 Service de Jobs

```python
# app/services/job_service.py

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import logging

from app.models.job import Job, JobStatus
from app.core.scheduler import JobScheduler

logger = logging.getLogger(__name__)

class JobService:
    """Service pour la gestion des jobs planifiés"""
    
    def __init__(self, db: Session):
        self.db = db
        self.scheduler = JobScheduler()
    
    def create_job(
        self,
        user_id: int,
        job_name: str,
        job_type: str,
        frequency: str,
        config: dict
    ) -> Job:
        """Créer un nouveau job"""
        
        # Calculer la prochaine exécution
        next_run = self._calculate_next_run(frequency)
        
        # Créer le job
        job = Job(
            user_id=user_id,
            job_name=job_name,
            job_type=job_type,
            frequency=frequency,
            config=config,
            next_run=next_run,
            status=JobStatus.PENDING
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        
        logger.info(f"Job créé: {job.id}")
        
        return job
    
    def _calculate_next_run(self, frequency: str) -> datetime:
        """Calculer la prochaine exécution"""
        now = datetime.utcnow()
        
        if frequency == "once":
            return now
        elif frequency == "hourly":
            return now + timedelta(hours=1)
        elif frequency == "daily":
            return now + timedelta(days=1)
        elif frequency == "weekly":
            return now + timedelta(weeks=1)
        elif frequency == "monthly":
            return now + timedelta(days=30)
        else:
            return now
    
    def get_user_jobs(self, user_id: int) -> List[Job]:
        """Obtenir tous les jobs d'un utilisateur"""
        return self.db.query(Job).filter(Job.user_id == user_id).all()
    
    def get_job(self, job_id: int) -> Job:
        """Obtenir un job"""
        job = self.db.query(Job).filter(Job.id == job_id).first()
        
        if not job:
            raise ValueError("Job non trouvé")
        
        return job
    
    def pause_job(self, job_id: int):
        """Mettre en pause un job"""
        job = self.get_job(job_id)
        job.is_active = False
        self.db.commit()
        logger.info(f"Job pausé: {job_id}")
    
    def resume_job(self, job_id: int):
        """Reprendre un job"""
        job = self.get_job(job_id)
        job.is_active = True
        self.db.commit()
        logger.info(f"Job repris: {job_id}")
    
    def delete_job(self, job_id: int):
        """Supprimer un job"""
        job = self.get_job(job_id)
        self.db.delete(job)
        self.db.commit()
        logger.info(f"Job supprimé: {job_id}")
```

---

# 6. ROUTES <a name="routes"></a>

## 6.1 Routes d'Authentification

```python
# app/routes/auth_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers.auth_controller import AuthController
from app.schemas.user import UserCreate, UserLogin
from app.database.session import get_db

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=dict)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Enregistrer un nouvel utilisateur"""
    controller = AuthController(db)
    return await controller.register(user_data)

@router.post("/login", response_model=dict)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Se connecter"""
    controller = AuthController(db)
    return await controller.login(credentials)

@router.post("/refresh", response_model=dict)
async def refresh_token(
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)  # A implémenter
):
    """Rafraîchir le token"""
    controller = AuthController(db)
    return await controller.refresh_token(current_user)

@router.post("/logout", response_model=dict)
async def logout(
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Se déconnecter"""
    controller = AuthController(db)
    return await controller.logout(current_user)
```

## 6.2 Routes d'Analyses

```python
# app/routes/analysis_routes.py

from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session

from app.controllers.analysis_controller import AnalysisController
from app.database.session import get_db

router = APIRouter(
    prefix="/api/v1/analysis",
    tags=["Analysis"]
)

@router.post("/basic")
async def basic_analysis(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Analyse basique"""
    controller = AnalysisController(db)
    return await controller.basic_analysis(file, current_user)

@router.post("/comprehensive")
async def comprehensive_analysis(
    file: UploadFile = File(...),
    include_predictions: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Analyse complète"""
    controller = AnalysisController(db)
    return await controller.comprehensive_analysis(file, include_predictions, current_user)

@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Obtenir une analyse"""
    controller = AnalysisController(db)
    return await controller.get_analysis(analysis_id, current_user)
```

## 6.3 Routes de Jobs

```python
# app/routes/job_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.controllers.job_controller import JobController
from app.schemas.job import JobCreate, JobResponse
from app.database.session import get_db

router = APIRouter(
    prefix="/api/v1/jobs",
    tags=["Jobs"]
)

@router.post("/schedule", response_model=JobResponse)
async def schedule_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Planifier un job"""
    controller = JobController(db)
    return await controller.schedule_analysis(job_data, current_user)

@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Lister les jobs"""
    controller = JobController(db)
    return await controller.list_jobs(current_user)

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Obtenir un job"""
    controller = JobController(db)
    return await controller.get_job(job_id, current_user)

@router.put("/{job_id}/pause")
async def pause_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Mettre en pause"""
    controller = JobController(db)
    return await controller.pause_job(job_id, current_user)

@router.put("/{job_id}/resume")
async def resume_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Reprendre"""
    controller = JobController(db)
    return await controller.resume_job(job_id, current_user)

@router.delete("/{job_id}")
async def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)
):
    """Supprimer"""
    controller = JobController(db)
    return await controller.delete_job(job_id, current_user)
```

## 6.4 Routeur Principal v1

```python
# app/routes/v1_router.py

from fastapi import APIRouter
from app.routes import auth_routes, analysis_routes, job_routes, report_routes

# Créer le routeur principal
v1_router = APIRouter(prefix="/api/v1")

# Inclure les routeurs
v1_router.include_router(auth_routes.router)
v1_router.include_router(analysis_routes.router)
v1_router.include_router(job_routes.router)
v1_router.include_router(report_routes.router)
```

---

# 7. MIDDLEWARE <a name="middleware"></a>

## 7.1 Middleware d'Authentification

```python
# app/middleware/auth_middleware.py

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """Middleware pour l'authentification"""
    
    async def dispatch(self, request: Request, call_next):
        """Traiter la requête"""
        
        # Vérifier le header Authorization
        auth_header = request.headers.get("Authorization")
        
        if not auth_header and request.url.path.startswith("/api"):
            # Certains endpoints ne nécessitent pas d'auth
            public_endpoints = [
                "/api/v1/auth/register",
                "/api/v1/auth/login",
                "/api/health"
            ]
            
            if request.url.path not in public_endpoints:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Token manquant"}
                )
        
        response = await call_next(request)
        return response
```

## 7.2 Middleware de Logging

```python
# app/middleware/logging_middleware.py

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware pour le logging"""
    
    async def dispatch(self, request: Request, call_next):
        """Logger les requêtes"""
        
        # Temps de début
        start_time = time.time()
        
        # Traiter la requête
        response = await call_next(request)
        
        # Temps écoulé
        duration = time.time() - start_time
        
        # Logger
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Duration: {duration:.2f}s"
        )
        
        return response
```

## 7.3 Middleware de Sécurité

```python
# app/middleware/security_middleware.py

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    """Middleware pour la sécurité"""
    
    async def dispatch(self, request: Request, call_next):
        """Ajouter les headers de sécurité"""
        
        response = await call_next(request)
        
        # Ajouter les headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000"
        
        return response
```

---

# 8. EXEMPLE COMPLET <a name="exemple"></a>

## 8.1 Configuration d'une Fonctionnalité Complète

### User Registration Flow

```
1. CLIENT
   └─ POST /api/v1/auth/register
      └─ UserCreate(username, email, password)

2. ROUTER (auth_routes.py)
   └─ register() endpoint
      └─ Appelle controller

3. CONTROLLER (auth_controller.py)
   └─ AuthController.register()
      └─ Appelle service

4. SERVICE (auth_service.py)
   └─ AuthService.register_user()
      └─ Valide les données
      └─ Hash le mot de passe
      └─ Appelle Model

5. MODEL (models/user.py)
   └─ User()
      └─ Sauvegarde en BD

6. DATABASE
   └─ PostgreSQL
      └─ INSERT INTO users ...

7. RESPONSE
   └─ JSON {"id": 1, "username": "john", ...}
      └─ CLIENT
```

### Data Analysis Flow

```
1. CLIENT
   └─ POST /api/v1/analysis/basic
      └─ File + JWT Token

2. ROUTER (analysis_routes.py)
   └─ basic_analysis()
      └─ Middleware: Authentification ✓
      └─ Appelle controller

3. CONTROLLER (analysis_controller.py)
   └─ AnalysisController.basic_analysis()
      └─ Valide le fichier
      └─ Charge le fichier
      └─ Appelle service

4. SERVICE (analysis_service.py)
   └─ AnalysisService.analyze_basic()
      └─ DataFrame operations
      └─ Appelle analyzer

5. CORE (core/analyzer.py)
   └─ DataAnalyzer.analyze()
      └─ Statistics
      └─ Retourne résultats

6. SERVICE (continues)
   └─ save_analysis()
      └─ Appelle Model

7. MODEL (models/analysis.py)
   └─ Analysis()
      └─ Sauvegarde en BD

8. RESPONSE
   └─ JSON {results: {...}}
      └─ CLIENT
```

## 8.2 Arborescence d'Appels

```python
# main.py
@app.on_event("startup")
async def startup():
    # Initialiser les connexions
    pass

# Inclure les routeurs
app.include_router(v1_router)

# Ajouter les middleware
app.add_middleware(AuthMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityMiddleware)

# ============================================

# Route hit
POST /api/v1/analysis/basic
    │
    ├─ SecurityMiddleware
    │   └─ Add headers
    │
    ├─ LoggingMiddleware
    │   └─ Log request
    │
    ├─ AuthMiddleware
    │   └─ Verify token
    │
    ├─ analysis_routes.basic_analysis()
    │   │
    │   └─ AnalysisController(db)
    │       │
    │       ├─ validate_file()
    │       │
    │       ├─ load_file()
    │       │   └─ await file.read()
    │       │       └─ pd.read_csv() / pd.read_excel()
    │       │
    │       └─ AnalysisService(db).analyze_basic(df)
    │           │
    │           └─ DataAnalyzer().analyze(df)
    │               │
    │               ├─ df.describe()
    │               ├─ df.dtypes
    │               ├─ df.isnull()
    │               └─ return results
    │           │
    │           └─ save_analysis() → Model → DB
    │
    └─ Return AnalysisResponse JSON
        │
        └─ Client
```

---

## 📝 Résumé MVC

| Couche | Responsabilité |
|--------|-----------------|
| **Route** | Mapper les URLs, accepter les requêtes |
| **Middleware** | Sécurité, logging, validation globale |
| **Controller** | Recevoir la requête, valider, formater la réponse |
| **Service** | Logique métier, transactions, orchestration |
| **Model** | Représenter les données, ORM |
| **Database** | Persistance des données |

---

**Architecture MVC complète et professionnel pour votre API!** 🎉
