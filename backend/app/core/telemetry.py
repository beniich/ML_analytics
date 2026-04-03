"""
CORE — OpenTelemetry Setup
Traces distribuées : FastAPI + SQLAlchemy → Jaeger (dev) / Grafana Tempo (prod)

Lancer Jaeger en local :
    docker run -d --name jaeger \
      -p 16686:16686 -p 4317:4317 -p 4318:4318 \
      jaegertracing/all-in-one:latest
"""
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)


def setup_telemetry(app) -> None:
    """
    Configure OpenTelemetry pour l'application FastAPI.
    Nécessite : opentelemetry-sdk, opentelemetry-instrumentation-fastapi,
                opentelemetry-exporter-otlp, opentelemetry-instrumentation-sqlalchemy
    """
    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
        from opentelemetry.sdk.resources import Resource, SERVICE_NAME
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

        # Endpoint OTLP (Jaeger en dev, Grafana Tempo / Collectors en prod)
        otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
        service_name  = os.getenv("OTEL_SERVICE_NAME", "ml-analytics-api")

        resource = Resource.create({SERVICE_NAME: service_name})
        provider = TracerProvider(resource=resource)

        # Exporter OTLP (Jaeger)
        try:
            from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
            otlp_exporter = OTLPSpanExporter(endpoint=otlp_endpoint, insecure=True)
            provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
            logger.info(f"✅ OTel → Jaeger/OTLP : {otlp_endpoint}")
        except Exception as e:
            # Fallback console
            provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
            logger.warning(f"⚠️  OTLP indisponible, traces → console : {e}")

        trace.set_tracer_provider(provider)

        # Auto-instrumentation FastAPI
        FastAPIInstrumentor.instrument_app(app)

        # Auto-instrumentation SQLAlchemy
        try:
            from app.database.session import engine
            SQLAlchemyInstrumentor().instrument(engine=engine)
            logger.info("✅ OTel SQLAlchemy instrumenté")
        except Exception:
            pass

        logger.info(f"🔭 OpenTelemetry activé — service={service_name}")

    except ImportError as e:
        logger.warning(f"⚠️  OpenTelemetry non installé ({e}), traces désactivées")
    except Exception as e:
        logger.error(f"❌ Erreur setup OTel : {e}")
