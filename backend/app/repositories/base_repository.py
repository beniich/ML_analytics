"""
REPOSITORY — Base générique CRUD
Abstrait toutes les interactions SQLAlchemy pour les services.
"""
from typing import Generic, TypeVar, Type, Optional, List, Any
from sqlalchemy.orm import Session
from app.database.session import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Repository CRUD générique pour tous les modèles SQLAlchemy."""

    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db    = db

    def get(self, id: int) -> Optional[ModelType]:
        return self.db.get(self.model, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def filter_by(self, **kwargs) -> List[ModelType]:
        return self.db.query(self.model).filter_by(**kwargs).all()

    def find_one(self, **kwargs) -> Optional[ModelType]:
        return self.db.query(self.model).filter_by(**kwargs).first()

    def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        self.db.flush()   # flush sans commit — le UoW committera
        self.db.refresh(obj)
        return obj

    def update(self, obj: ModelType, **data) -> ModelType:
        for key, value in data.items():
            setattr(obj, key, value)
        self.db.flush()
        return obj

    def delete(self, obj: ModelType) -> None:
        self.db.delete(obj)
        self.db.flush()

    def exists(self, **kwargs) -> bool:
        return self.db.query(self.model).filter_by(**kwargs).first() is not None
