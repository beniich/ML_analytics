import redis
import json
import pickle
from typing import Any, Optional
from datetime import timedelta

class RedisCache:
    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0):
        try:
            self.client = redis.Redis(host=host, port=port, db=db, decode_responses=False)
        except Exception as e:
            print(f"Failed to connect to Redis: {e}")
            self.client = None
    
    def set(self, key: str, value: Any, expire_time: int = 3600) -> bool:
        """Stocke une valeur dans le cache avec expiration"""
        if not self.client: return False
        try:
            serialized_value = pickle.dumps(value)
            return self.client.setex(key, expire_time, serialized_value)
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Récupère une valeur du cache"""
        if not self.client: return None
        try:
            value = self.client.get(key)
            if value is None:
                return None
            return pickle.loads(value)
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """Supprime une clé du cache"""
        if not self.client: return False
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Vérifie si une clé existe"""
        if not self.client: return False
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            print(f"Cache exists check error: {e}")
            return False
    
    def get_or_set(self, key: str, compute_func, expire_time: int = 3600) -> Any:
        """Obtient du cache ou calcule et stocke"""
        cached_result = self.get(key)
        if cached_result is not None:
            return cached_result
        
        # Calculer la valeur
        result = compute_func()
        self.set(key, result, expire_time)
        return result

# Instance globale
cache = RedisCache()

def generate_cache_key(prefix: str, params: dict) -> str:
    """Génère une clé de cache basée sur les paramètres"""
    param_str = "_".join([f"{k}={v}" for k, v in sorted(params.items())])
    return f"{prefix}:{param_str}"
