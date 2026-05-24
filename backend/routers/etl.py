"""
ETL router — Extract / Transform / Load pipeline for the LMS.

Endpoints
---------
GET /etl/summary          Extract-phase summary (record counts per table).
GET /etl/export/books     Download books.csv
GET /etl/export/borrowers Download borrowers.csv
GET /etl/export/transactions  Download enriched transactions report CSV
                              (joins title + borrower name, adds days_borrowed,
                               status, and overdue flag).
"""

import csv
import io
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(prefix="/etl", tags=["ETL"])


# ------------------------------------------------------------------ helpers

def _csv_response(filename: str, rows: List[Dict[str, Any]]) -> StreamingResponse:
    """Turn a list of dicts into a CSV StreamingResponse."""
    if not rows:
        output = io.StringIO()
        output.write("")
    else:
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _days_between(start: datetime, end: datetime) -> int:
    delta = end.replace(tzinfo=None) - start.replace(tzinfo=None)
    return max(delta.days, 0)


# ------------------------------------------------------------------ Extract

@router.get("/summary")
def etl_summary(db: Session = Depends(get_db)):
    """Extract phase: return record counts and basic stats for each table."""
    total_books = db.query(models.Book).count()
    available = db.query(models.Book).filter(
        models.Book.availability_status == "Available"
    ).count()
    total_borrowers = db.query(models.Borrower).count()
    total_tx = db.query(models.Transaction).count()
    active_tx = db.query(models.Transaction).filter(
        models.Transaction.return_date.is_(None)
    ).count()

    return {
        "extracted_at": datetime.utcnow().isoformat() + "Z",
        "tables": {
            "books":        {"total": total_books, "available": available, "borrowed": total_books - available},
            "borrowers":    {"total": total_borrowers},
            "transactions": {"total": total_tx, "active": active_tx, "returned": total_tx - active_tx},
        },
    }


# ------------------------------------------------------------------ Load (CSV exports)

@router.get("/export/books")
def export_books(db: Session = Depends(get_db)):
    """Load phase: export all books as books.csv."""
    books = db.query(models.Book).all()
    rows = [
        {
            "book_id": b.book_id,
            "title": b.title,
            "author": b.author,
            "category": b.category,
            "isbn": b.isbn,
            "availability_status": b.availability_status,
        }
        for b in books
    ]
    return _csv_response("books.csv", rows)


@router.get("/export/borrowers")
def export_borrowers(db: Session = Depends(get_db)):
    """Load phase: export all borrowers as borrowers.csv."""
    borrowers = db.query(models.Borrower).all()
    rows = [
        {
            "borrower_id": b.borrower_id,
            "borrower_name": b.borrower_name,
            "email": b.email,
            "phone": b.phone,
        }
        for b in borrowers
    ]
    return _csv_response("borrowers.csv", rows)


@router.get("/export/transactions")
def export_transactions(db: Session = Depends(get_db)):
    """
    Transform + Load phase: export enriched transactions report.

    Transformations applied:
    - Join book title and borrower name from related tables.
    - Derive days_borrowed (elapsed days; open loans counted to today).
    - Derive status: 'Active' | 'Returned'.
    - Flag overdue: Active loans open longer than 14 days.
    """
    now = datetime.utcnow()
    txs = (
        db.query(models.Transaction)
        .order_by(models.Transaction.borrow_date.desc())
        .all()
    )
    rows = []
    for t in txs:
        book = t.book
        borrower = t.borrower
        end = t.return_date if t.return_date else now
        days = _days_between(t.borrow_date, end)
        status = "Returned" if t.return_date else "Active"
        overdue = "Yes" if status == "Active" and days > 14 else "No"
        rows.append({
            "transaction_id": t.transaction_id,
            "book_id": t.book_id,
            "book_title": book.title if book else "",
            "borrower_id": t.borrower_id,
            "borrower_name": borrower.borrower_name if borrower else "",
            "borrower_email": borrower.email if borrower else "",
            "borrow_date": t.borrow_date.strftime("%Y-%m-%d %H:%M:%S"),
            "return_date": t.return_date.strftime("%Y-%m-%d %H:%M:%S") if t.return_date else "",
            "days_borrowed": days,
            "status": status,
            "overdue": overdue,
        })
    return _csv_response("transactions_report.csv", rows)
