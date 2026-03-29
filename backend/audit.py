"""
Audit trailing with HMAC chaining for tamper-evident logging
"""
import os
import hmac
import hashlib
from datetime import datetime
from sqlalchemy.orm import Session
from models import AuditLog

AUDIT_SECRET = os.getenv("AUDIT_HMAC_SECRET", "super-secret-audit-key-for-hmac").encode('utf-8')

def sign_audit_entry(action: str, user_id: int, resource: str, details: str, previous_hash: str) -> str:
    """Creates an HMAC signature chaining the previous log entry to ensure sequence integrity"""
    payload = f"{action}|{user_id}|{resource}|{details}|{previous_hash}".encode('utf-8')
    hmac_obj = hmac.new(AUDIT_SECRET, payload, hashlib.sha256)
    return hmac_obj.hexdigest()

def record_audit(db: Session, user_id: int, action: str, resource: str, details: str = ""):
    """Record a new tamper-evident audit log entry"""
    # Get last entry for chaining
    last_log = db.query(AuditLog).order_by(AuditLog.id.desc()).first()
    previous_hash = last_log.signature if last_log else "GENESIS"
    
    signature = sign_audit_entry(action, user_id, resource, details, previous_hash)
    
    new_log = AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        details=details,
        previous_hash=previous_hash,
        signature=signature
    )
    db.add(new_log)
    db.commit()

def verify_audit_chain(db: Session) -> bool:
    """Verify that no audit logs were tampered with or deleted"""
    logs = db.query(AuditLog).order_by(AuditLog.id.asc()).all()
    
    for i, log in enumerate(logs):
        expected_prev_hash = logs[i-1].signature if i > 0 else "GENESIS"
        
        if log.previous_hash != expected_prev_hash:
            return False # Chain broken
        
        # Verify the signature of this entry
        recomputed_sig = sign_audit_entry(
            log.action, log.user_id, log.resource, log.details, log.previous_hash
        )
        if not hmac.compare_digest(recomputed_sig, log.signature):
            return False # Payload modified
            
    return True
