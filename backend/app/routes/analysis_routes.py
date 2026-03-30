"""
ROUTES — Analyses  /api/v1/analysis
"""
from fastapi import APIRouter, Depends, File, UploadFile, Query
from sqlalchemy.orm import Session

from app.controllers import AnalysisController
from app.database    import get_db
from app.dependencies import get_current_user
from app.models      import User

router = APIRouter(prefix="/api/v1/analysis", tags=["📊 Analysis"])


@router.post("/basic", summary="Analyse basique d'un fichier")
async def basic_analysis(
    file:         UploadFile    = File(...),
    current_user: User          = Depends(get_current_user),
    db:           Session       = Depends(get_db),
):
    return await AnalysisController(db).basic(file, current_user)


@router.post("/comprehensive", summary="Analyse complète avec corrélations")
async def comprehensive_analysis(
    file:         UploadFile  = File(...),
    current_user: User        = Depends(get_current_user),
    db:           Session     = Depends(get_db),
):
    return await AnalysisController(db).comprehensive(file, current_user)


@router.get("/history", summary="Historique des analyses")
async def analysis_history(
    limit:        int    = Query(50, ge=1, le=200),
    current_user: User   = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    return await AnalysisController(db).history(current_user, limit)


@router.get("/{analysis_id}", summary="Détail d'une analyse")
async def get_analysis(
    analysis_id:  int,
    current_user: User    = Depends(get_current_user),
    db:           Session  = Depends(get_db),
):
    return await AnalysisController(db).get_analysis(analysis_id, current_user)
