"""
EVENT HANDLERS — Consumers des DomainEvents
Enregistrés via le décorateur @on(EventClass)
"""
import logging
from app.events.event_bus    import on
from app.events.domain_events import (
    UserRegistered, UserLoggedIn,
    AnalysisCompleted, AnalysisFailed,
    JobCompleted, JobFailed,
)

logger = logging.getLogger(__name__)


@on(UserRegistered)
async def handle_user_registered(event: UserRegistered):
    logger.info(f"🎉 Nouvel utilisateur : {event.username} ({event.email})")
    # TODO: envoyer email de bienvenue via SendGrid/SES


@on(UserLoggedIn)
async def handle_user_logged_in(event: UserLoggedIn):
    logger.info(f"🔑 Connexion : {event.username}")
    # TODO: audit log, détection anomalie


@on(AnalysisCompleted)
async def handle_analysis_completed(event: AnalysisCompleted):
    logger.info(
        f"📊 Analyse #{event.analysis_id} terminée "
        f"({event.rows_processed} lignes en {event.execution_time:.2f}s)"
    )
    # TODO: notification WebSocket, mise à jour dashboard


@on(AnalysisFailed)
async def handle_analysis_failed(event: AnalysisFailed):
    logger.error(f"❌ Analyse échouée pour user {event.user_id} : {event.error}")
    # TODO: alerting, retry logic


@on(JobCompleted)
async def handle_job_completed(event: JobCompleted):
    logger.info(f"⚙️  Job '{event.job_name}' (#{event.job_id}) terminé")
    # TODO: notification utilisateur


@on(JobFailed)
async def handle_job_failed(event: JobFailed):
    logger.error(f"💥 Job #{event.job_id} échoué : {event.error}")
    # TODO: retry, alerting admin
