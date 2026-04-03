"""
CORE — Feature Flags Service
Dev : lecture depuis feature_flags.json
Prod : LaunchDarkly SDK
"""
import json
import logging
import os
from typing import Any, Optional

logger = logging.getLogger(__name__)

# Chemin du fichier de flags local (dev)
FLAGS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "feature_flags.json")

# Valeurs par défaut si le fichier est absent
_DEFAULTS = {
    "enable_comprehensive_analysis": True,
    "enable_job_scheduler":          True,
    "enable_ml_predictions":         False,
    "enable_redis_cache":            False,
    "enable_event_bus":              True,
    "enable_api_v2":                 False,
    "enable_2fa":                    True,
}


class FeatureFlagService:
    """
    Service Feature Flags multi-provider.
    - LaunchDarkly si LAUNCHDARKLY_SDK_KEY est défini
    - Fichier JSON local sinon
    """

    def __init__(self):
        self._ld_client = None
        self._local_flags: dict = {}
        self._provider = "local"
        self._setup()

    def _setup(self) -> None:
        sdk_key = os.getenv("LAUNCHDARKLY_SDK_KEY")

        if sdk_key:
            try:
                import ldclient
                from ldclient.config import Config
                ldclient.set_config(Config(sdk_key))
                self._ld_client = ldclient.get()
                self._provider = "launchdarkly"
                logger.info("✅ Feature Flags → LaunchDarkly")
            except ImportError:
                logger.warning("⚠️  launchdarkly-server-sdk non installé, fallback JSON")
                self._load_local()
            except Exception as e:
                logger.warning(f"⚠️  LaunchDarkly erreur ({e}), fallback JSON")
                self._load_local()
        else:
            self._load_local()

    def _load_local(self) -> None:
        self._provider = "local"
        try:
            path = os.path.abspath(FLAGS_FILE)
            with open(path) as f:
                self._local_flags = json.load(f)
            logger.info(f"✅ Feature Flags → JSON local : {path}")
        except FileNotFoundError:
            self._local_flags = _DEFAULTS.copy()
            logger.info("✅ Feature Flags → valeurs par défaut")

    def is_enabled(self, flag_key: str, user_key: str = "anonymous") -> bool:
        """Vérifie si un flag est activé pour un utilisateur."""
        if self._provider == "launchdarkly" and self._ld_client:
            try:
                context = {"key": user_key}
                return bool(self._ld_client.variation(flag_key, context, False))
            except Exception as e:
                logger.warning(f"⚠️  LD variation error : {e}")

        return bool(self._local_flags.get(flag_key, _DEFAULTS.get(flag_key, False)))

    def get_all(self) -> dict:
        """Retourne tous les flags (pour debug)."""
        return self._local_flags if self._provider == "local" else {}

    def reload(self) -> None:
        """Recharge les flags locaux (sans redéploiement)."""
        if self._provider == "local":
            self._load_local()

    def __call__(self, flag_key: str, user_key: str = "anonymous") -> bool:
        return self.is_enabled(flag_key, user_key)


# Singleton global
feature_flags = FeatureFlagService()


def get_feature_flags() -> FeatureFlagService:
    """FastAPI Dependency."""
    return feature_flags
