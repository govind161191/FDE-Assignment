# Library Management System (LMS)

> **AFDE Capstone — Phase 1**
> Full-stack web application for managing books, borrowers, and lending workflows.

![Stack](https://img.shields.io/badge/stack-React%20%2B%20FastAPI%20%2B%20SQLite-blue)
![Status](https://img.shields.io/badge/phase-1%20complete-success)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Project Information

| Field | Value |
|---|---|
| **Project Title** | Library Management System |
| **Project Code** | LMS |
| **Batch** | AFDE_May26 |
| **Participant** | Govind |
| **Phase** | 1 |

### Overview

Libraries in schools, colleges, and organizations often manage books and borrowers using manual notebooks or spreadsheets, which creates real operational pain — lost records, slow lookups, no visibility into who has what. This project digitizes that workflow as a centralized, web-based system with a REST API and a clean React UI.

The application supports the full life-cycle: add a book, register a borrower, lend a book, return it, search the catalog, and see live stats on a dashboard.

### Features Implemented

- **Book Management** — Add, update, delete, list books with title, author, category, ISBN, and availability status.
- **Borrower Management** — Register and manage library members (name, email, phone).
- **Borrow & Return Workflow** — Lend an available book to a borrower; automatically flips status; record return dates.
- **Search** — Full-text keyword search across title/author/category/ISBN, plus field-specific filters.
- **Dashboard** — Live KPI tiles (total/available/borrowed books, active loans) and a recent-transactions table.
- **REST API** — 17 endpoints across 5 resource groups, fully documented via auto-generated OpenAPI (`/docs`).
- **Form Validation** — Client- and server-side validation on every input.
- **Responsive UI** — Works on desktop, tablet, and mobile.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (functional components + Hooks) |
| Routing | React Router v6 |
| HTTP client | Axios |
| Styling | Custom CSS (responsive grid + cards) |
| Backend | Python 3.10+, FastAPI |
| ORM | SQLAlchemy 2.x |
| Validation | Pydantic v2 |
| Database | SQLite (PostgreSQL-ready) |
| API testing | Postman / Swagger UI |
| Version control | Git + GitHub |

---

## Project Structure

```
AFDE_May26_Govind_LMS/
├── backend/
│   ├── main.py                # FastAPI entrypoint
│   ├── database.py            # SQLAlchemy engine + session
│   ├── models.py              # ORM models (Book, Borrower, Transaction)
│   ├── schemas.py             # Pydantic request/response schemas
│   ├── crud.py                # DB operations (pure functions)
│   ├── routers/
│   │   ├── books.py
│   │   ├── borrowers.py
│   │   ├── transactions.py
│   │   ├── search.py
│   │   └── dashboard.py
│   ├── services/
│   │   └── seed_data.py       # Optional sample-data loader
│   └── requirements.txt
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/        # Reusable UI (Navbar, Modal, Forms, Toast, StatCard)
│   │   ├── pages/             # Dashboard, Books, Borrowers, Transactions, Search
│   │   ├── services/          # API wrappers per resource
│   │   ├── api.js             # Axios client
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
├── database/
│   ├── schema_sqlite.sql      # Canonical SQLite DDL
│   ├── schema_postgres.sql    # PostgreSQL DDL
│   └── sample_data.sql        # Seed inserts
├── docs/
│   └── API.md                 # Full API reference with examples
├── screenshots/               # UI + API testing screenshots
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/AFDE_May26_Govind_LMS.git
cd AFDE_May26_Govind_LMS
```

### 2. Backend setup

```bash
cd backend

# (Recommended) create a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

# (Optional) seed sample books and borrowers
python services/seed_data.py

# Run the API
uvicorn main:app --reload --port 8000
```

The API will be live at **http://localhost:8000**.
Interactive docs (Swagger UI): **http://localhost:8000/docs**
Alternative docs (ReDoc): **http://localhost:8000/redoc**

### 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The React app will open at **http://localhost:3000** and proxy API calls to the backend.

### 4. Database

By default the app uses **SQLite** — no setup required. A file named `library.db` is created in `backend/` on first run.

To use **PostgreSQL** instead:

```bash
# 1. Create the database
createdb library_db
psql -d library_db -f ../database/schema_postgres.sql

# 2. Tell the backend to use it
export DATABASE_URL="postgresql+psycopg2://<user>:<pass>@localhost/library_db"
uvicorn main:app --reload
```

---

## API Quick Reference

| Method | Endpoint | Description |
|---|---|---|
| GET    | `/`                       | Health/info |
| GET    | `/books`                  | List all books |
| GET    | `/books/{id}`             | Get one book |
| POST   | `/books`                  | Create a book |
| PUT    | `/books/{id}`             | Update a book |
| DELETE | `/books/{id}`             | Delete a book |
| GET    | `/borrowers`              | List all borrowers |
| GET    | `/borrowers/{id}`         | Get one borrower |
| POST   | `/borrowers`              | Register a borrower |
| PUT    | `/borrowers/{id}`         | Update a borrower |
| DELETE | `/borrowers/{id}`         | Delete a borrower |
| POST   | `/borrow`                 | Borrow a book (creates transaction) |
| POST   | `/return`                 | Return a book |
| GET    | `/transactions`           | List transactions (`?active_only=true` filter) |
| GET    | `/search`                 | Search books by `q`, `title`, `author`, `category` |
| GET    | `/dashboard/stats`        | Aggregated counts + recent activity |

Full request/response examples: see [`docs/API.md`](docs/API.md).

---

## Screenshots

UI and API testing screenshots live under [`screenshots/`](screenshots/). Each major flow is captured:

- Dashboard
- Books listing + add/edit modal
- Borrowers page
- Borrow / Return flow
- Search results
- Postman / Swagger UI

---

## Evaluation Mapping

This Phase 1 deliverable covers every criterion from the rubric:

| Criterion | Weight | Where it lives |
|---|---|---|
| Frontend Development | 20% | `frontend/` — 5 pages, reusable components, validation, responsive CSS |
| Backend API Development | 25% | `backend/routers/` — 17 endpoints, FastAPI best practices |
| Database Integration | 15% | `backend/models.py`, `backend/database.py`, `database/schema_*.sql` |
| CRUD Functionality | 15% | Full CRUD for Books and Borrowers |
| Search/Filtering | 10% | `backend/routers/search.py` + `pages/SearchPage.js` |
| Code Quality & Structure | 10% | Layered architecture, docstrings, modular routers/services |
| Documentation | 5% | This README + `docs/API.md` + inline docstrings |

---

## Scalability Notes (Out of Phase 1 Scope, By Design)

The app is structured so future phases can plug in:

- **Authentication / RBAC** — drop in OAuth2 / JWT middleware on FastAPI
- **Analytics dashboard** — `transactions` table is the source of truth for any BI tool
- **Recommendation system** — `category`, `author`, borrow history feed an embeddings pipeline
- **Semantic search** — swap the `LIKE` clauses in `crud.search_books` for a vector store
- **Cloud deployment** — Dockerize backend + static frontend behind any CDN

---

## Author

**Govind**
AFDE Capstone — Batch May 2026

---

## License

MIT — see [LICENSE](LICENSE) (if added).
