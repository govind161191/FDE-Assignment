"""
Dashboard router — aggregated stats for the home screen.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from routers.transactions import _enrich


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    """Return aggregate counts and the 5 most-recent transactions."""
    stats = crud.get_dashboard_stats(db)
    stats["recent_transactions"] = [_enrich(t, db) for t in stats["recent_transactions"]]
    return stats
