"""
Transactions router — borrow / return workflows and transaction history.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(tags=["Transactions"])


def _enrich(tx, db: Session) -> schemas.TransactionOut:
    """Attach book title and borrower name to a Transaction for UI convenience."""
    book = crud.get_book(db, tx.book_id)
    borrower = crud.get_borrower(db, tx.borrower_id)
    return schemas.TransactionOut(
        transaction_id=tx.transaction_id,
        book_id=tx.book_id,
        borrower_id=tx.borrower_id,
        borrow_date=tx.borrow_date,
        return_date=tx.return_date,
        book_title=book.title if book else None,
        borrower_name=borrower.borrower_name if borrower else None,
    )


@router.post("/borrow", response_model=schemas.TransactionOut, status_code=status.HTTP_201_CREATED)
def borrow_book(payload: schemas.BorrowRequest, db: Session = Depends(get_db)):
    """Borrow an available book on behalf of a registered borrower."""
    book = crud.get_book(db, payload.book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    if book.availability_status != "Available":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Book is not available for borrowing")
    borrower = crud.get_borrower(db, payload.borrower_id)
    if not borrower:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrower not found")
    tx = crud.borrow_book(db, payload.book_id, payload.borrower_id)
    if not tx:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to create borrow transaction")
    return _enrich(tx, db)


@router.post("/return", response_model=schemas.TransactionOut)
def return_book(payload: schemas.ReturnRequest, db: Session = Depends(get_db)):
    """Mark a transaction as returned and flip the book back to Available."""
    tx = crud.return_book(db, payload.transaction_id)
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid transaction or book has already been returned",
        )
    return _enrich(tx, db)


@router.get("/transactions", response_model=List[schemas.TransactionOut])
def list_transactions(
    active_only: bool = Query(False, description="Only return transactions still on loan"),
    db: Session = Depends(get_db),
):
    """List all transactions, optionally filtered to active (un-returned) loans."""
    txs = crud.get_transactions(db, active_only=active_only)
    return [_enrich(t, db) for t in txs]
