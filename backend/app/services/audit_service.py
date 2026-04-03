"""
SERVICE — Audit Logging
Enregistre les actions critiques de manière asynchrone via redis.
"""
import logging
from datetime import datetime
from app.events import event_bus, DomainEvent

logger = logging.getLogger(__name__)

class AuditService:
    @staticmethod
    def log_action(user_id: int, username: str, action: str, details: str = "", ip: str = "unknown"):
        """Publie un événement d'audit dans le bus d'événements."""
        event = DomainEvent(
            type="user.audit_log",
            payload={
                "user_id": user_id,
                "username": username,
                "action": action,
                "details": details,
                "ip": ip,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        # Publication asynchrone (Redis Streams)
        event_bus.publish(event)
        logger.info(f"📝 Audit: [{username}] {action} - {details}")

audit_service = AuditService()
