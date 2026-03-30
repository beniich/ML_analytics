import os
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import AnalysisReport, User
from routers.auth_router import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("")
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(10),
):
    reports = db.query(AnalysisReport).filter(AnalysisReport.user_id == current_user.id).offset(skip).limit(limit).all()
    total = db.query(AnalysisReport).filter(AnalysisReport.user_id == current_user.id).count()
    return {
        "total": total,
        "reports": [
            {"id": r.id, "name": r.report_name, "type": r.report_type,
             "created_at": r.created_at.isoformat(), "description": r.description}
            for r in reports
        ],
    }

@router.get("/{report_id}")
async def get_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).filter(
        AnalysisReport.id == report_id, AnalysisReport.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"id": report.id, "name": report.report_name, "type": report.report_type,
            "created_at": report.created_at.isoformat(), "data": report.report_data}

@router.delete("/{report_id}")
async def delete_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).filter(
        AnalysisReport.id == report_id, AnalysisReport.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if report.file_path and os.path.exists(report.file_path):
        os.remove(report.file_path)
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}
