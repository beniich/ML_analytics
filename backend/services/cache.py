"""
Redis Cache Module
High-performance caching for analysis results
"""
import redis
import json
import pickle
from typing import Any, Optional, Callable, Dict
import logging

logger = logging.getLogger(__name__)

class RedisCache:
    """Redis cache wrapper with serialization support"""
    
    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0, password: Optional[str] = None):
        try:
            self.client = redis.Redis(host=host, port=port, db=db, password=password, decode_responses=False)
            self.client.ping()
            self.connected = True
            logger.info(f"Connected to Redis at {host}:{port}")
        except Exception as e:
            self.connected = False
            logger.error(f"Failed to connect to Redis: {str(e)}")
    
    def set(self, key: str, value: Any, expire_time: int = 3600) -> bool:
        """Store a value in cache with expiration"""
        if not self.connected:
            return False
        try:
            serialized_value = pickle.dumps(value)
            self.client.setex(key, expire_time, serialized_value)
            logger.debug(f"Cached key: {key}")
            return True
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {str(e)}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Retrieve a value from cache"""
        if not self.connected:
            return None
        try:
            value = self.client.get(key)
            if value is None:
                return None
            return pickle.loads(value)
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {str(e)}")
            return None
    
    def exists(self, key: str) -> bool:
        """Check if a key exists"""
        if not self.connected:
            return False
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            logger.error(f"Cache exists error: {str(e)}")
            return False
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        if not self.connected:
            return {"connected": False}
        try:
            info = self.client.info()
            return {
                "connected": True,
                "used_memory_mb": info.get('used_memory', 0) / (1024**2),
                "total_connections": info.get('total_connections_received', 0)
            }
        except Exception as e:
            logger.error(f"Error getting cache stats: {str(e)}")
            return {"error": str(e)}

# Global cache instance
try:
    cache = RedisCache()
except:
    cache = None
    logger.warning("Redis cache not available")
