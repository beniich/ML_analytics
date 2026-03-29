"""
AI Gateway Service
Stateless API Gateway for local LLMs via Ollama & vector search via Qdrant
"""
import os
import httpx
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

# Configuration
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")

gateway_app = FastAPI(title="AI Gateway", version="1.0", description="Local AI Gateway for LLMs & Embeddings")

try:
    qdrant = QdrantClient(url=Qdrant_URL) if QDRANT_URL else None
except Exception:
    qdrant = None

# Ensure Qdrant 'documents' collection exists
COLLECTION_NAME = "documents"
try:
    if qdrant and not qdrant.collection_exists(COLLECTION_NAME):
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )
except Exception as e:
    print(f"Warning: Could not initialize Qdrant collection: {e}")

class PromptRequest(BaseModel):
    prompt: str
    system: Optional[str] = None
    stream: bool = False

async def _call_ollama(model: str, prompt: str, system: Optional[str] = None, stream: bool = False, options: dict = None) -> Dict:
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
            raise HTTPException(status_code=502, detail=f"Ollama API Error: {str(e)}")

@gateway_app.post("/api/ai/draft")
async def draft_content(req: PromptRequest):
    """Use Llama 3.1 for drafting and complex reasoning"""
    return await _call_ollama(
        model="llama3.1", 
        prompt=req.prompt, 
        system=req.system or "You are an expert technical writer and assistant.",
        stream=req.stream
    )

@gateway_app.post("/api/ai/summary")
async def summarize_content(req: PromptRequest):
    """Use Mistral for fast, accurate text summarization"""
    return await _call_ollama(
        model="mistral", 
        prompt=req.prompt, 
        system="Summarize the following content concisely and extract key bullet points.",
        stream=req.stream,
        options={"temperature": 0.3} # Lower temperature for factual summary
    )

@gateway_app.post("/api/ai/ocr")
async def extract_vision(
    prompt: str = Form("Describe exactly what is in this image."),
    file: UploadFile = File(...)
):
    """Use LLaVA for multimodal OCR and vision extraction"""
    # Read and encode image to base64
    import base64
    content = await file.read()
    b64_img = base64.b64encode(content).decode('utf-8')
    
    payload = {
        "model": "llava",
        "prompt": prompt,
        "images": [b64_img],
        "stream": False
    }
    
    async with httpx.AsyncClient(timeout=180.0) as client:
        try:
            response = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Ollama Vision API Error: {str(e)}")

@gateway_app.post("/api/ai/embed")
async def embed_document(text: str, doc_id: str, metadata: dict = None):
    """Embed text using nomic-embed-text and store in Qdrant"""
    if not qdrant:
        raise HTTPException(status_code=500, detail="Qdrant client not initialized")
        
    # Get embedding from Ollama
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{OLLAMA_URL}/api/embeddings", json={
            "model": "nomic-embed-text",
            "prompt": text
        })
        res.raise_for_status()
        embedding_data = res.json().get("embedding")
        
    if not embedding_data:
        raise HTTPException(status_code=500, detail="Failed to get embedding")

    # Store in Qdrant
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=doc_id, 
                vector=embedding_data, 
                payload={"text": text, **(metadata or {})}
            )
        ]
    )
    return {"status": "success", "doc_id": doc_id}

@gateway_app.get("/api/ai/search")
async def semantic_search(query: str, limit: int = 5):
    """Semantic search against embedded documents"""
    if not qdrant:
        raise HTTPException(status_code=500, detail="Qdrant client not initialized")
        
    # Embed the search query
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{OLLAMA_URL}/api/embeddings", json={
            "model": "nomic-embed-text",
            "prompt": query
        })
        res.raise_for_status()
        query_vector = res.json().get("embedding")
        
    # Search Qdrant
    search_result = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=limit
    )
    
    return {
        "results": [
            {"id": str(hit.id), "score": hit.score, "payload": hit.payload}
            for hit in search_result
        ]
    }
