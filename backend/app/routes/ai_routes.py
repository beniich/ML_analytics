"""
ROUTES — AI Copilot & LLMs
Intégration de l'Assistant d'Analyse (Ollama)
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
import logging

from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai", tags=["🧠 AI Copilot"])

class ChatRequest(BaseModel):
    message: str

class SummaryRequest(BaseModel):
    data: str

@router.post("/chat")
async def ai_chat(req: ChatRequest):
    """Dialogue direct avec le copilot ML (basé sur Llama 3.1)"""
    logger.info(f"Chat IA reçu: {req.message[:50]}...")
    result = await ai_service.draft_analysis(req.message)
    return {"reply": result.get("response", "Erreur réseau avec l'IA.")}

@router.post("/summarize")
async def ai_summary(req: SummaryRequest):
    """Résume un long jeu de résultats ML"""
    result = await ai_service.summarize_report(req.data)
    return {"summary": result.get("response", "Erreur réseau.")}
