"""
Help, Support & Changelog Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime
import logging

from models import User
from auth import get_current_user
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/support", tags=["Support"])

_tickets: list = []
_ticket_counter = 1

ARTICLES = [
    {"id": 1, "title": "Getting Started with ML Analytics", "category": "onboarding", "views": 1420},
    {"id": 2, "title": "How to upload a CSV dataset", "category": "data", "views": 980},
    {"id": 3, "title": "Understanding Correlation Analysis", "category": "analysis", "views": 760},
    {"id": 4, "title": "Setting up Job Scheduler", "category": "automation", "views": 540},
    {"id": 5, "title": "Time Series Forecasting Guide", "category": "analysis", "views": 890},
    {"id": 6, "title": "API Keys & Authentication", "category": "security", "views": 430},
    {"id": 7, "title": "Billing Plans & Quotas", "category": "billing", "views": 310},
    {"id": 8, "title": "Feature Engineering Studio", "category": "modeling", "views": 620},
    {"id": 9, "title": "Data Quality Scorecard", "category": "data", "views": 480},
    {"id": 10, "title": "Docker Deployment Guide", "category": "infrastructure", "views": 295},
]

CHANGELOG = [
    {
        "version": "5.1.0",
        "date": "2026-03-20",
        "highlights": ["Kafka integration", "Feature Engineering Studio", "Insight Copilot AI"],
        "changes": [
            {"type": "feat", "text": "Added Apache Kafka event streaming"},
            {"type": "feat", "text": "Feature Engineering Studio with 4 transform types"},
            {"type": "feat", "text": "InsightCopilot — AI assistant for data questions"},
            {"type": "fix", "text": "Fixed JWT token refresh race condition"},
            {"type": "improved", "text": "Dashboard sidebar now collapsible"},
        ]
    },
    {
        "version": "5.0.0",
        "date": "2026-03-01",
        "highlights": ["Full MLOps stack", "MLflow integration", "AutoML Architect"],
        "changes": [
            {"type": "feat", "text": "AutoML Architect module launched"},
            {"type": "feat", "text": "MLflow experiment tracking integrated"},
            {"type": "feat", "text": "Model Deployment Wizard"},
            {"type": "improved", "text": "Glassmorphism UI overhaul"},
        ]
    },
    {
        "version": "4.2.1",
        "date": "2026-02-10",
        "highlights": ["Bug fixes & stability"],
        "changes": [
            {"type": "fix", "text": "Fixed CSV encoding issues on Windows"},
            {"type": "fix", "text": "Resolved memory leak in anomaly detector"},
        ]
    }
]


class TicketRequest(BaseModel):
    subject: str
    description: str
    priority: str = "normal"  # low, normal, high, urgent


@router.get("/articles")
async def get_articles(
    q: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """Get help articles, optionally filtered by query"""
    articles = ARTICLES
    if q:
        q_lower = q.lower()
        articles = [a for a in ARTICLES if q_lower in a["title"].lower() or q_lower in a["category"].lower()]
    return {"total": len(articles), "articles": articles}


@router.get("/changelog")
async def get_changelog(current_user: User = Depends(get_current_user)):
    """Get product changelog"""
    return {"versions": CHANGELOG, "latest": CHANGELOG[0]["version"] if CHANGELOG else None}


@router.get("/status")
async def get_status(current_user: User = Depends(get_current_user)):
    """Get platform operational status"""
    return {
        "status": "operational",
        "last_checked": datetime.utcnow().isoformat(),
        "services": {
            "api": "operational",
            "database": "operational",
            "kafka": "operational",
            "mlflow": "operational",
            "cache": "degraded"
        },
        "incidents": [],
        "uptime_30d_pct": 99.92
    }


@router.post("/ticket")
async def submit_ticket(
    req: TicketRequest,
    current_user: User = Depends(get_current_user)
):
    """Submit a support ticket"""
    global _ticket_counter
    ticket = {
        "id": _ticket_counter,
        "user_id": current_user.id,
        "subject": req.subject,
        "description": req.description,
        "priority": req.priority,
        "status": "open",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    _tickets.append(ticket)
    _ticket_counter += 1
    return {"status": "submitted", "ticket": ticket}
