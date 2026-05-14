"""
Search router — keyword and field-based search across the books catalog.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(tags=["Search"])


@router.get("/search", response_model=List[schemas.BookOut])
def search_books(
    q: Optional[str] = Query(None, description="Keyword search across title, author, category, isbn"),
    title: Optional[str] = Query(None, description="Filter by title (partial match)"),
    author: Optional[str] = Query(None, description="Filter by author (partial match)"),
    category: Optional[str] = Query(None, description="Filter by category (partial match)"),
    db: Session = Depends(get_db),
):
    """Search books by keyword or filter by specific fields."""
    return crud.search_books(db, q=q, title=title, author=author, category=category)
