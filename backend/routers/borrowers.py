"""
Borrowers router — CRUD endpoints for library members.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(prefix="/borrowers", tags=["Borrowers"])


@router.get("", response_model=List[schemas.BorrowerOut])
def list_borrowers(db: Session = Depends(get_db)):
    """Retrieve all registered borrowers."""
    return crud.get_borrowers(db)


@router.get("/{borrower_id}", response_model=schemas.BorrowerOut)
def get_borrower(borrower_id: int, db: Session = Depends(get_db)):
    """Retrieve a single borrower by ID."""
    borrower = crud.get_borrower(db, borrower_id)
    if not borrower:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrower not found")
    return borrower


@router.post("", response_model=schemas.BorrowerOut, status_code=status.HTTP_201_CREATED)
def add_borrower(borrower: schemas.BorrowerCreate, db: Session = Depends(get_db)):
    """Register a new borrower."""
    existing = crud.get_borrower_by_email(db, borrower.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A borrower with this email already exists")
    return crud.create_borrower(db, borrower)


@router.put("/{borrower_id}", response_model=schemas.BorrowerOut)
def update_borrower(borrower_id: int, borrower: schemas.BorrowerUpdate, db: Session = Depends(get_db)):
    """Update an existing borrower."""
    updated = crud.update_borrower(db, borrower_id, borrower)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrower not found")
    return updated


@router.delete("/{borrower_id}", status_code=status.HTTP_200_OK)
def delete_borrower(borrower_id: int, db: Session = Depends(get_db)):
    """Delete a borrower by ID."""
    ok = crud.delete_borrower(db, borrower_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrower not found")
    return {"message": "Borrower deleted successfully", "borrower_id": borrower_id}
