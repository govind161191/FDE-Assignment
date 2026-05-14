"""
Books router — CRUD + search endpoints for the books resource.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(prefix="/books", tags=["Books"])


@router.get("", response_model=List[schemas.BookOut])
def list_books(db: Session = Depends(get_db)):
    """Retrieve all books in the catalog."""
    return crud.get_books(db)


@router.get("/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    """Retrieve a single book by its ID."""
    book = crud.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return book


@router.post("", response_model=schemas.BookOut, status_code=status.HTTP_201_CREATED)
def add_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    """Add a new book to the catalog."""
    existing = crud.get_book_by_isbn(db, book.isbn)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A book with this ISBN already exists")
    return crud.create_book(db, book)


@router.put("/{book_id}", response_model=schemas.BookOut)
def update_book(book_id: int, book: schemas.BookUpdate, db: Session = Depends(get_db)):
    """Update an existing book."""
    updated = crud.update_book(db, book_id, book)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return updated


@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book by ID."""
    ok = crud.delete_book(db, book_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return {"message": "Book deleted successfully", "book_id": book_id}
