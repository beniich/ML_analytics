"""
EVENT BUS — Redis Streams (prod) + in-memory (dev/fallback)
Publie et consomme des DomainEvents de façon asynchrone.
"""
import json
import logging
import asyncio
from typing import Callable, Dict, List, Type
from dataclasses import asdict

import redis.asyncio as aioredis

from app.config import REDIS_URL, CACHE_ENABLED
from app.events.domain_events import DomainEvent

logger = logging.getLogger(__name__)

# ── Handlers registry ──────────────────────────────────────────────────────
_handlers: Dict[str, List[Callable]] = {}


def on(event_class: Type[DomainEvent]):
    """Décorateur pour enregistrer un handler d'événement."""
    def decorator(func: Callable) -> Callable:
        key = event_class.__name__
        _handlers.setdefault(key, []).append(func)
        logger.debug(f"📬 Handler enregistré : {func.__name__} → {key}")
        return func
    return decorator


class EventBus:
    """
    Bus d'événements :
    - En dev (CACHE_ENABLED=False) : execution in-process synchrone
    - En prod (CACHE_ENABLED=True) : Redis Streams async
    """

    _redis_client = None

    @classmethod
    async def _get_redis(cls):
        if cls._redis_client is None and CACHE_ENABLED:
            try:
                cls._redis_client = aioredis.from_url(REDIS_URL, decode_responses=True)
                await cls._redis_client.ping()
                logger.info("✅ EventBus connecté à Redis Streams")
            except Exception as e:
                logger.warning(f"⚠️  EventBus Redis indisponible, mode in-process : {e}")
                cls._redis_client = None
        return cls._redis_client

    @classmethod
    async def publish(cls, event: DomainEvent) -> None:
        """Publie un événement."""
        event_name = type(event).__name__
        payload = {
            **asdict(event),
            "_event_type": event_name,
            "_occurred_at": str(event.occurred_at),
        }

        r = await cls._get_redis()
        if r:
            # Redis Streams
            try:
                stream_key = f"events:{event_name.lower()}"
                await r.xadd(stream_key, {k: json.dumps(v, default=str) for k, v in payload.items()})
                logger.info(f"📤 Event publié sur Redis Stream : {event_name}")
            except Exception as e:
                logger.error(f"❌ Erreur publication Redis : {e}")
                await cls._dispatch_locally(event_name, event)
        else:
            # Mode in-process
            await cls._dispatch_locally(event_name, event)

    @classmethod
    async def _dispatch_locally(cls, event_name: str, event: DomainEvent) -> None:
        """Dispatch local synchrone (dev/fallback)."""
        handlers = _handlers.get(event_name, [])
        if not handlers:
            logger.debug(f"💬 Aucun handler pour : {event_name}")
            return
        for handler in handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(event)
                else:
                    handler(event)
                logger.debug(f"✅ Handler exécuté : {handler.__name__}")
            except Exception as e:
                logger.error(f"❌ Erreur handler {handler.__name__} : {e}")


event_bus = EventBus()
