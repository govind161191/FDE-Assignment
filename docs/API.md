# API Reference

Base URL (local): `http://localhost:8000`
Interactive Swagger UI: `http://localhost:8000/docs`
Interactive ReDoc:      `http://localhost:8000/redoc`

All responses are JSON. All timestamps are UTC ISO-8601.

---

## Health

### `GET /`

Returns service metadata.

```json
{
  "service": "Library Management System API",
  "version": "1.0.0",
  "status": "ok",
  "docs": "/docs"
}
```

### `GET /health`
```json
{ "status": "healthy" }
```

---

## Books

### `GET /books` — list all books

```bash
curl http://localhost:8000/books
```

Response:
```json
[
  {
    "book_id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Programming",
    "isbn": "9780132350884",
    "availability_status": "Available"
  }
]
```

### `GET /books/{book_id}` — retrieve one book
`404` if not found.

### `POST /books` — create a book

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fluent Python",
    "author": "Luciano Ramalho",
    "category": "Programming",
    "isbn": "9781491946008"
  }'
```

Returns `201 Created` with the new resource.
`400` if ISBN already exists.

### `PUT /books/{book_id}` — update a book

Any subset of fields is allowed:
```bash
curl -X PUT http://localhost:8000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"category": "Software Engineering"}'
```

### `DELETE /books/{book_id}`
```json
{ "message": "Book deleted successfully", "book_id": 1 }
```

---

## Borrowers

### `GET /borrowers` — list all borrowers
### `GET /borrowers/{borrower_id}` — retrieve one
### `POST /borrowers` — register a borrower

```bash
curl -X POST http://localhost:8000/borrowers \
  -H "Content-Type: application/json" \
  -d '{
    "borrower_name": "Govind Kumar",
    "email": "govind@example.com",
    "phone": "9876543210"
  }'
```
`400` if the email already exists.

### `PUT /borrowers/{borrower_id}` — partial update
### `DELETE /borrowers/{borrower_id}`

---

## Transactions

### `POST /borrow` — borrow a book

```bash
curl -X POST http://localhost:8000/borrow \
  -H "Content-Type: application/json" \
  -d '{ "book_id": 1, "borrower_id": 1 }'
```

Response (`201`):
```json
{
  "transaction_id": 1,
  "book_id": 1,
  "borrower_id": 1,
  "borrow_date": "2026-05-15T09:14:21Z",
  "return_date": null,
  "book_title": "Clean Code",
  "borrower_name": "Govind Kumar"
}
```

Error cases:
- `404` — book or borrower not found
- `400` — book is not currently available

### `POST /return` — return a book

```bash
curl -X POST http://localhost:8000/return \
  -H "Content-Type: application/json" \
  -d '{ "transaction_id": 1 }'
```

`400` if the transaction doesn't exist or is already closed.

### `GET /transactions` — list transactions

Optional query param:
- `active_only=true` — only un-returned loans

```bash
curl "http://localhost:8000/transactions?active_only=true"
```

---

## Search

### `GET /search`

Query parameters (all optional, combine freely):

| Param | Description |
|---|---|
| `q` | Keyword across title, author, category, ISBN |
| `title` | Partial match on title |
| `author` | Partial match on author |
| `category` | Partial match on category |

```bash
curl "http://localhost:8000/search?q=python"
curl "http://localhost:8000/search?author=Martin&category=Programming"
```

Returns a list of `Book` objects (same shape as `GET /books`).

---

## Dashboard

### `GET /dashboard/stats`

Aggregated counters plus the 5 most-recent transactions — used by the home screen.

```json
{
  "total_books": 10,
  "available_books": 8,
  "borrowed_books": 2,
  "total_borrowers": 3,
  "active_transactions": 2,
  "recent_transactions": [
    {
      "transaction_id": 3,
      "book_id": 2,
      "borrower_id": 1,
      "borrow_date": "2026-05-15T09:30:00Z",
      "return_date": null,
      "book_title": "The Pragmatic Programmer",
      "borrower_name": "Govind Kumar"
    }
  ]
}
```

---

## Error Format

FastAPI returns standard problem-style JSON:

```json
{ "detail": "Book not found" }
```

For Pydantic validation failures (`422`):

```json
{
  "detail": [
    {
      "loc": ["body", "isbn"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## CORS

The API allows requests from these origins by default:

- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite, if you migrate later)
