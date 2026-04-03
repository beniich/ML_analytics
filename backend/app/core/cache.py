"""
CORE — Cache multi-niveaux
L1 : cachetools (in-process, ultra-rapide)
L2 : Redis (partagé entre instances)
"""
import json
import logging
import functools
from typing import Any, Callable, Optional
from datetime import timedelta

from cachetools import TTLCache
import redis as redis_lib

from app.config import REDIS_URL, CACHE_ENABLED

logger = logging.getLogger(__name__)

# ── L1 : In-process (max 1000 entrées, TTL 5 min) ─────────────────────────
_L1: TTLCache = TTLCache(maxsize=1000, ttl=300)

# ── L2 : Redis ────────────────────────────────────────────────────────────
_redis: Optional[redis_lib.Redis] = None

def _get_redis() -> Optional[redis_lib.Redis]:
    global _redis
    if _redis is None and CACHE_ENABLED:
        try:
            _redis = redis_lib.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=1)
            _redis.ping()
        except Exception as e:
            logger.warning(f"⚠️  Redis cache indisponible : {e}")
            _redis = None
    return _redis


class CacheManager:
    """Interface unifiée pour L1 + L2."""

    @staticmethod
    def get(key: str) -> Optional[Any]:
        # L1
        if key in _L1:
            return _L1[key]
        # L2
        r = _get_redis()
        if r:
            try:
                raw = r.get(f"cache:{key}")
                if raw:
                    value = json.loads(raw)
                    _L1[key] = value   # repeupler L1
                    return value
            except Exception:
                pass
        return None

    @staticmethod
    def set(key: str, value: Any, ttl: int = 60) -> None:
        _L1[key] = value
        r = _get_redis()
        if r:
            try:
                r.setex(f"cache:{key}", ttl, json.dumps(value, default=str))
            except Exception:
                pass

    @staticmethod
    def delete(key: str) -> None:
        _L1.pop(key, None)
        r = _get_redis()
        if r:
            try:
                r.delete(f"cache:{key}")
            except Exception:
                pass

    @staticmethod
    def clear_pattern(pattern: str) -> None:
        """Supprime toutes les clés Redis matchant un pattern."""
        # Vider L1 entier (conservative)
        _L1.clear()
        r = _get_redis()
        if r:
            try:
                keys = r.keys(f"cache:{pattern}")
                if keys:
                    r.delete(*keys)
            except Exception:
                pass


cache = CacheManager()


def cached(ttl: int = 60, key_fn: Optional[Callable] = None):
    """
    Décorateur de cache multi-niveaux.

    Usage :
        @cached(ttl=120, key_fn=lambda self, user_id: f"history:{user_id}")
        async def get_user_history(self, user_id: int): ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            key = key_fn(*args, **kwargs) if key_fn else f"{func.__qualname__}:{args}:{kwargs}"
            cached_val = cache.get(key)
            if cached_val is not None:
                logger.debug(f"🎯 Cache HIT : {key}")
                return cached_val
            result = await func(*args, **kwargs)
            cache.set(key, result, ttl=ttl)
            logger.debug(f"💾 Cache SET : {key} (ttl={ttl}s)")
            return result

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            key = key_fn(*args, **kwargs) if key_fn else f"{func.__qualname__}:{args}:{kwargs}"
            cached_val = cache.get(key)
            if cached_val is not None:
                logger.debug(f"🎯 Cache HIT : {key}")
                return cached_val
            result = func(*args, **kwargs)
            cache.set(key, result, ttl=ttl)
            logger.debug(f"💾 Cache SET : {key} (ttl={ttl}s)")
            return result

        import asyncio
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator
