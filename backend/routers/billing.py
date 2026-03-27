"""
Billing & Subscription Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from datetime import datetime
import logging

from models import User
from auth import get_current_user
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/billing", tags=["Billing"])

# Simulated subscription plans
PLANS = {
    "free": {"name": "Free", "price": 0, "api_calls": 1000, "storage_gb": 1, "models": 3},
    "pro": {"name": "Pro", "price": 49, "api_calls": 50000, "storage_gb": 50, "models": 50},
    "enterprise": {"name": "Enterprise", "price": 299, "api_calls": -1, "storage_gb": 1000, "models": -1},
}

# In-memory user plan store  
_user_plans: dict = {}
_user_credits: dict = {}
_transactions: list = []


class CreditsRequest(BaseModel):
    amount: float


class UpgradeRequest(BaseModel):
    plan_id: str


@router.get("/quotas")
async def get_quotas(current_user: User = Depends(get_current_user)):
    """Get current usage quotas for the user"""
    plan_id = _user_plans.get(current_user.id, "free")
    plan = PLANS.get(plan_id, PLANS["free"])
    credits = _user_credits.get(current_user.id, 0.0)

    return {
        "user_id": current_user.id,
        "plan": plan_id,
        "plan_details": plan,
        "credits": credits,
        "usage": {
            "api_calls_used": 47,
            "api_calls_limit": plan["api_calls"],
            "storage_used_gb": 0.3,
            "storage_limit_gb": plan["storage_gb"],
            "models_trained": 2,
            "models_limit": plan["models"],
        },
        "billing_cycle_end": "2026-04-27",
    }


@router.get("/subscription")
async def get_subscription(current_user: User = Depends(get_current_user)):
    """Get current subscription details"""
    plan_id = _user_plans.get(current_user.id, "free")
    plan = PLANS.get(plan_id, PLANS["free"])
    return {
        "plan_id": plan_id,
        "plan": plan,
        "status": "active",
        "started_at": "2026-01-01",
        "renews_at": "2026-04-27",
        "auto_renew": True,
    }


@router.get("/transactions")
async def get_transactions(current_user: User = Depends(get_current_user)):
    """Get billing transaction history"""
    user_tx = [t for t in _transactions if t["user_id"] == current_user.id]
    return {"total": len(user_tx), "transactions": user_tx}


@router.post("/upgrade")
async def upgrade_plan(
    req: UpgradeRequest,
    current_user: User = Depends(get_current_user)
):
    """Upgrade subscription plan"""
    if req.plan_id not in PLANS:
        raise HTTPException(status_code=400, detail=f"Unknown plan: {req.plan_id}")

    old_plan = _user_plans.get(current_user.id, "free")
    _user_plans[current_user.id] = req.plan_id
    plan = PLANS[req.plan_id]

    tx = {
        "id": len(_transactions) + 1,
        "user_id": current_user.id,
        "type": "upgrade",
        "from_plan": old_plan,
        "to_plan": req.plan_id,
        "amount": plan["price"],
        "created_at": datetime.utcnow().isoformat()
    }
    _transactions.append(tx)

    return {
        "status": "upgraded",
        "from_plan": old_plan,
        "to_plan": req.plan_id,
        "transaction": tx
    }


@router.post("/credits/add")
async def add_credits(
    req: CreditsRequest,
    current_user: User = Depends(get_current_user)
):
    """Add credits to user account"""
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    _user_credits[current_user.id] = _user_credits.get(current_user.id, 0.0) + req.amount
    tx = {
        "id": len(_transactions) + 1,
        "user_id": current_user.id,
        "type": "credits",
        "amount": req.amount,
        "created_at": datetime.utcnow().isoformat()
    }
    _transactions.append(tx)
    return {
        "status": "credits_added",
        "added": req.amount,
        "total_credits": _user_credits[current_user.id]
    }
