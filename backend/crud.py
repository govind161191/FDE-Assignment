"""
CRUD service layer.

Pure database operations isolated from FastAPI routing concerns.
This makes the application easier to test and reuse.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from datetime import datetime
from typing import List, Optional

import models
import schemas


# ------------------------- Books -------------------------

def get_books(db: Session, skip: int = 0, limit: int = 1000) -> List[models.Book]:
    return db.query(models.Book).offset(skip).limit(limit).all()


def get_book(db: Session, book_id: int) -> Optional[models.Book]:
    return db.query(models.Book).filter(models.Book.book_id == book_id).first()


def get_book_by_isbn(db: Session, isbn: str) -> Optional[models.Book]:
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def create_book(db: Session, book: schemas.BookCreate) -> models.Book:
    db_book = models.Book(
        title=book.title,
        author=book.author,
        category=book.category,
        isbn=book.isbn,
        availability_status=book.availability_status or "Available",
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, book_id: int, book: schemas.BookUpdate) -> Optional[models.Book]:
    db_book = get_book(db, book_id)
    if not db_book:
        return None
    update_data = book.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_book, field, value)
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: int) -> bool:
    db_book = get_book(db, book_id)
    if not db_book:
        return False
    db.delete(db_book)
    db.commit()
    return True


def search_books(
    db: Session,
    q: Optional[str] = None,
    title: Optional[str] = None,
    author: Optional[str] = None,
    category: Optional[str] = None,
) -> List[models.Book]:
    """Search books by keyword (across title/author/category) or by specific field."""
    query = db.query(models.Book)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                models.Book.title.ilike(like),
                models.Book.author.ilike(like),
                models.Book.category.ilike(like),
                models.Book.isbn.ilike(like),
            )
        )
    if title:
        query = query.filter(models.Book.title.ilike(f"%{title}%"))
    if author:
        query = query.filter(models.Book.author.ilike(f"%{author}%"))
    if category:
        query = query.filter(models.Book.category.ilike(f"%{category}%"))
    return query.all()


# ------------------------- Borrowers -------------------------

def get_borrowers(db: Session) -> List[models.Borrower]:
    return db.query(models.Borrower).all()


def get_borrower(db: Session, borrower_id: int) -> Optional[models.Borrower]:
    return db.query(models.Borrower).filter(models.Borrower.borrower_id == borrower_id).first()


def get_borrower_by_email(db: Session, email: str) -> Optional[models.Borrower]:
    return db.query(models.Borrower).filter(models.Borrower.email == email).first()


def create_borrower(db: Session, borrower: schemas.BorrowerCreate) -> models.Borrower:
    db_borrower = models.Borrower(**borrower.model_dump())
    db.add(db_borrower)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower


def update_borrower(db: Session, borrower_id: int, borrower: schemas.BorrowerUpdate) -> Optional[models.Borrower]:
    db_borrower = get_borrower(db, borrower_id)
    if not db_borrower:
        return None
    update_data = borrower.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_borrower, field, value)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower


def delete_borrower(db: Session, borrower_id: int) -> bool:
    db_borrower = get_borrower(db, borrower_id)
    if not db_borrower:
        return False
    db.delete(db_borrower)
    db.commit()
    return True


# ------------------------- Transactions -------------------------

def borrow_book(db: Session, book_id: int, borrower_id: int) -> Optional[models.Transaction]:
    """Create a transaction marking a book as borrowed.

    Returns None if the book or borrower doesn't exist, or if book is not available.
    """
    book = get_book(db, book_id)
    borrower = get_borrower(db, borrower_id)
    if not book or not borrower:
        return None
    if book.availability_status != "Available":
        return None

    tx = models.Transaction(
        book_id=book_id,
        borrower_id=borrower_id,
        borrow_date=datetime.utcnow(),
        return_date=None,
    )
    book.availability_status = "Borrowed"
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


def return_book(db: Session, transaction_id: int) -> Optional[models.Transaction]:
    """Mark an open transaction as returned and flip the book back to Available."""
    tx = db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()
    if not tx or tx.return_date is not None:
        return None
    tx.return_date = datetime.utcnow()
    book = get_book(db, tx.book_id)
    if book:
        book.availability_status = "Available"
    db.commit()
    db.refresh(tx)
    return tx


def get_transactions(db: Session, active_only: bool = False) -> List[models.Transaction]:
    q = db.query(models.Transaction)
    if active_only:
        q = q.filter(models.Transaction.return_date.is_(None))
    return q.order_by(models.Transaction.borrow_date.desc()).all()


# ------------------------- Dashboard helpers -------------------------

def get_dashboard_stats(db: Session) -> dict:
    total_books = db.query(func.count(models.Book.book_id)).scalar() or 0
    available_books = db.query(func.count(models.Book.book_id)).filter(
        models.Book.availability_status == "Available"
    ).scalar() or 0
    borrowed_books = total_books - available_books
    total_borrowers = db.query(func.count(models.Borrower.borrower_id)).scalar() or 0
    active_transactions = db.query(func.count(models.Transaction.transaction_id)).filter(
        models.Transaction.return_date.is_(None)
    ).scalar() or 0
    recent = (
        db.query(models.Transaction)
        .order_by(models.Transaction.borrow_date.desc())
        .limit(5)
        .all()
    )
    return {
        "total_books": total_books,
        "available_books": available_books,
        "borrowed_books": borrowed_books,
        "total_borrowers": total_borrowers,
        "active_transactions": active_transactions,
        "recent_transactions": recent,
    }
