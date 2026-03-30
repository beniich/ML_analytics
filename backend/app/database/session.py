"""
DATABASE — session & connexion
Migré depuis backend/database.py
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from sqlalchemy.pool import StaticPool

from app.config import DATABASE_URL, SQLALCHEMY_ECHO
import logging

logger = logging.getLogger(__name__)


# ── Base déclarative ───────────────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Moteur ─────────────────────────────────────────────────────────────────
_connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
_poolclass    = StaticPool if "sqlite" in DATABASE_URL else None

engine = create_engine(
    DATABASE_URL,
    connect_args=_connect_args,
    poolclass=_poolclass,
    echo=SQLALCHEMY_ECHO,
)

# ── Session factory ────────────────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Créer toutes les tables si elles n'existent pas."""
    try:
        # Import des modèles pour s'assurer qu'ils sont enregistrés
        from app.models import User, Workspace, AnalysisHistory, AnalysisReport  # noqa: F401
        from app.models import MLModel, ApiKey, AuditLog, Job                   # noqa: F401
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Base de données initialisée")
    except Exception as exc:
        logger.error(f"❌ Erreur init BD : {exc}")
        raise


def get_db():
    """Dependency FastAPI — fournit une session BD."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
