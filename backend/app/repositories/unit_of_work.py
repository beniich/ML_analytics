"""
UNIT OF WORK — Groupe toutes les transactions en une opération atomique.
Usage :
    with UnitOfWork(db) as uow:
        user = uow.users.find_by_username("john")
        uow.commit()
"""
import logging
from sqlalchemy.orm import Session

from .user_repository     import UserRepository
from .analysis_repository import AnalysisRepository
from .job_repository      import JobRepository

logger = logging.getLogger(__name__)


class UnitOfWork:
    """Groupe les repositories et gère la transaction atomique."""

    def __init__(self, db: Session):
        self._db       = db
        self.users     = UserRepository(db)
        self.analyses  = AnalysisRepository(db)
        self.jobs      = JobRepository(db)

    def commit(self) -> None:
        try:
            self._db.commit()
        except Exception:
            self.rollback()
            raise

    def rollback(self) -> None:
        self._db.rollback()

    def __enter__(self) -> "UnitOfWork":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type:
            logger.warning(f"UoW rollback sur exception : {exc_type.__name__}")
            self.rollback()
        else:
            self.commit()


def get_uow(db: Session) -> UnitOfWork:
    """Factory function — à injecter via Depends() dans FastAPI si besoin."""
    return UnitOfWork(db)
