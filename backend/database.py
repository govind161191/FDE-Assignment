"""
Database configuration for the Library Management System.

Uses SQLAlchemy ORM with SQLite by default. The DATABASE_URL environment
variable can be used to switch to PostgreSQL or another supported DB.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# Default to SQLite, but allow override via environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./library.db")

# SQLite-specific connection arg required for multi-threaded FastAPI usage
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# calling the db
def get_db():
    """FastAPI dependency that yields a database session and ensures it is closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
