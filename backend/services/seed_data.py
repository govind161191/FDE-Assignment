"""
Optional seed script — populates the database with sample books and borrowers
so the UI has data to show on first run.

Run from inside the backend/ folder:
    python services/seed_data.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine, Base
import models
import schemas
import crud


SAMPLE_BOOKS = [
    {"title": "Clean Code", "author": "Robert C. Martin", "category": "Programming", "isbn": "9780132350884"},
    {"title": "The Pragmatic Programmer", "author": "Andrew Hunt", "category": "Programming", "isbn": "9780201616224"},
    {"title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann", "category": "Databases", "isbn": "9781449373320"},
    {"title": "Atomic Habits", "author": "James Clear", "category": "Self-help", "isbn": "9780735211292"},
    {"title": "Sapiens", "author": "Yuval Noah Harari", "category": "History", "isbn": "9780062316097"},
    {"title": "Deep Learning", "author": "Ian Goodfellow", "category": "AI/ML", "isbn": "9780262035613"},
    {"title": "The Lean Startup", "author": "Eric Ries", "category": "Business", "isbn": "9780307887894"},
    {"title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "category": "Algorithms", "isbn": "9780262033848"},
    {"title": "Fluent Python", "author": "Luciano Ramalho", "category": "Programming", "isbn": "9781491946008"},
    {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "category": "Fiction", "isbn": "9780743273565"},
]

SAMPLE_BORROWERS = [
    {"borrower_name": "Govind Kumar", "email": "govind@example.com", "phone": "9876543210"},
    {"borrower_name": "Priya Sharma", "email": "priya@example.com", "phone": "9123456780"},
    {"borrower_name": "Rahul Verma", "email": "rahul@example.com", "phone": "9988776655"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        added_books = 0
        for b in SAMPLE_BOOKS:
            if not crud.get_book_by_isbn(db, b["isbn"]):
                crud.create_book(db, schemas.BookCreate(**b))
                added_books += 1
        added_borrowers = 0
        for br in SAMPLE_BORROWERS:
            if not crud.get_borrower_by_email(db, br["email"]):
                crud.create_borrower(db, schemas.BorrowerCreate(**br))
                added_borrowers += 1
        print(f"Seeded {added_books} books and {added_borrowers} borrowers.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
