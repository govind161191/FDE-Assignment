"""
Pydantic schemas for request/response validation.

Each entity has three flavors:
  - <Entity>Base:   shared fields
  - <Entity>Create: payload required to create the entity
  - <Entity>Update: optional fields for partial updates (PUT)
  - <Entity>Out:    response shape returned by the API
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ------------------------- Books -------------------------

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    isbn: str = Field(..., min_length=1, max_length=50)


class BookCreate(BookBase):
    availability_status: Optional[str] = "Available"


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    isbn: Optional[str] = None
    availability_status: Optional[str] = None


class BookOut(BookBase):
    book_id: int
    availability_status: str

    model_config = ConfigDict(from_attributes=True)


# ------------------------- Borrowers -------------------------

class BorrowerBase(BaseModel):
    borrower_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=20)


class BorrowerCreate(BorrowerBase):
    pass


class BorrowerUpdate(BaseModel):
    borrower_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class BorrowerOut(BorrowerBase):
    borrower_id: int

    model_config = ConfigDict(from_attributes=True)


# ------------------------- Transactions -------------------------

class BorrowRequest(BaseModel):
    book_id: int
    borrower_id: int


class ReturnRequest(BaseModel):
    transaction_id: int


class TransactionOut(BaseModel):
    transaction_id: int
    book_id: int
    borrower_id: int
    borrow_date: datetime
    return_date: Optional[datetime] = None
    # Friendly fields populated by services for the UI
    book_title: Optional[str] = None
    borrower_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ------------------------- Dashboard -------------------------

class DashboardStats(BaseModel):
    total_books: int
    available_books: int
    borrowed_books: int
    total_borrowers: int
    active_transactions: int
    recent_transactions: List[TransactionOut]
