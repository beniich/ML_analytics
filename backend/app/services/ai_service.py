import os
import httpx
import logging
from typing import Dict, Optional, List

logger = logging.getLogger(__name__)

# Configurations IA / Embeddings
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")

class AIService:
    """ Service centralisé pour interagir avec les modèles de langage locaux et vectoriels. """
    
    def __init__(self):
        self.qdrant = None
        self.collection_name = "documents"
        self._init_qdrant()

    def _init_qdrant(self):
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import VectorParams, Distance
            if QDRANT_URL:
                self.qdrant = QdrantClient(url=QDRANT_URL)
                if not self.qdrant.collection_exists(self.collection_name):
                    self.qdrant.create_collection(
                        collection_name=self.collection_name,
                        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
                    )
                logger.info(f"✅ AI Service connecté à Qdrant ({QDRANT_URL})")
        except Exception as e:
            logger.warning(f"⚠️ Initialisation Qdrant échouée (Ouvrez Docker Qdrant) : {e}")

    async def _call_ollama(self, model: str, prompt: str, system: Optional[str] = None, stream: bool = False, options: dict = None) -> Dict:
        """ Appelle le modèle LLM local via Ollama """
        payload = {
            "model": model, 
            "prompt": prompt, 
            "stream": stream
        }
        if system:
            payload["system"] = system
        if options:
            payload["options"] = options
            
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                # Mock response pour le design si Ollama n'est pas lancé localement
                logger.warning(f"⚠️ Impossible de joindre Ollama: {e}")
                return {
                    "response": f"[ℹ️ Copilote Hors Ligne] Impossible de joindre {model} sur {OLLAMA_URL}. Vérifiez qu'Ollama est bien démarré sur votre machine locale avec le modèle '{model}'.",
                    "model": model,
                    "created_at": "now",
                    "done": True
                }

    async def draft_analysis(self, prompt: str) -> Dict:
        """ Llama 3.1: Assistant d'analyse de données (Expert Data Science) """
        return await self._call_ollama(
            model="llama3.1", 
            prompt=prompt, 
            system="Tu es un Expert Data Scientist & Assistant Analytique ML. Réponds toujours en français de façon très concise, technique, et aide l'utilisateur avec des scripts Python ou des interprétations de modèles.",
        )

    async def summarize_report(self, text: str) -> Dict:
        """ Mistral: Résumés concis """
        return await self._call_ollama(
            model="mistral", 
            prompt=text, 
            system="Résume les données suivantes sous forme de 3 bullet points clairs.",
            options={"temperature": 0.2}
        )

ai_service = AIService()
