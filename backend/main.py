"""
FastAPI application entrypoint for the Library Management System.

Run locally with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models  # noqa: F401  -- ensure models are registered with Base
from routers import books, borrowers, transactions, search, dashboard, etl


# Create database tables on startup (Phase 1: simple, no migrations)
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Library Management System API",
    description=(
        "Phase 1 of the AFDE capstone Library Management System. "
        "Provides full CRUD over books and borrowers, borrow/return workflows, "
        "search, and a dashboard endpoint."
    ),
    version="1.0.0",
)


# CORS — allow the React frontend (default Create React App / Vite ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(books.router)
app.include_router(borrowers.router)
app.include_router(transactions.router)
app.include_router(search.router)
app.include_router(dashboard.router)
app.include_router(etl.router)


@app.get("/", tags=["Health"])
def root():
    """Health check / API root."""
    return {
        "service": "Library Management System API",
        "version": "1.0.0",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
