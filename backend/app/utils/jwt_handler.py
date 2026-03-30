"""
UTILS — JWT handler
Wrapper autour du système RS256 existant dans backend/auth.py
"""
import sys, os
# Permettre l'import depuis backend/ (dossier parent)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from auth import (
    create_access_token,
    create_refresh_token,
    verify_token,
    get_or_generate_rsa_keys,
    is_jti_denylisted,
    denylist_jti,
)

__all__ = [
    "create_access_token",
    "create_refresh_token",
    "verify_token",
    "get_or_generate_rsa_keys",
    "is_jti_denylisted",
    "denylist_jti",
]
