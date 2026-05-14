# Setup Guide

A step-by-step walkthrough for getting the Library Management System running on a fresh machine.

## 1. Install prerequisites

| Tool | Minimum version | Check |
|---|---|---|
| Python | 3.10 | `python --version` |
| Node.js | 18 | `node --version` |
| npm | 9 | `npm --version` |
| Git | any modern | `git --version` |

## 2. Clone

```bash
git clone https://github.com/<your-username>/AFDE_May26_Govind_LMS.git
cd AFDE_May26_Govind_LMS
```

## 3. Backend

```bash
cd backend
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Optional — populate sample data
python services/seed_data.py

# Run
uvicorn main:app --reload --port 8000
```

Verify the API is up:
```bash
curl http://localhost:8000/
```
Open Swagger UI: http://localhost:8000/docs

## 4. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

The browser opens at http://localhost:3000.

## 5. Smoke test

1. Go to **Books → + Add Book**, create a book.
2. Go to **Borrowers → + Add Borrower**, register a borrower.
3. Go to **Borrow / Return**, lend the book to that borrower.
4. Go to **Dashboard** — counters should reflect the new loan.
5. Go to **Borrow / Return → Return** to close the loop.

## Troubleshooting

**Backend fails with `sqlalchemy.exc.OperationalError: unable to open database file`**
Make sure you're running `uvicorn` from inside `backend/` so the relative `sqlite:///./library.db` resolves correctly.

**Frontend cannot reach API (Network Error / CORS)**
- Confirm the backend is on port 8000.
- The `proxy` field in `frontend/package.json` is set; if you change it, update `REACT_APP_API_URL` accordingly.

**Port already in use**
- Backend: `uvicorn main:app --port 8001`
- Frontend: `PORT=3001 npm start`

**Reset the database**
```bash
rm backend/library.db
# restart uvicorn — tables are recreated on startup
```
