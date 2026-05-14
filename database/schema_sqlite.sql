-- ============================================================
-- Library Management System — SQLite schema
-- ============================================================
-- This script is informational. In Phase 1 the FastAPI app
-- auto-creates these tables via SQLAlchemy on startup.
-- Use this file when you want to bootstrap the DB manually or
-- inspect the canonical schema.
-- ============================================================

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS borrowers;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
    book_id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title                TEXT    NOT NULL,
    author               TEXT    NOT NULL,
    category             TEXT    NOT NULL,
    isbn                 TEXT    NOT NULL UNIQUE,
    availability_status  TEXT    NOT NULL DEFAULT 'Available'
);
CREATE INDEX idx_books_title    ON books(title);
CREATE INDEX idx_books_author   ON books(author);
CREATE INDEX idx_books_category ON books(category);

CREATE TABLE borrowers (
    borrower_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    borrower_name  TEXT    NOT NULL,
    email          TEXT    NOT NULL UNIQUE,
    phone          TEXT    NOT NULL
);
CREATE INDEX idx_borrowers_name ON borrowers(borrower_name);

CREATE TABLE transactions (
    transaction_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id         INTEGER NOT NULL,
    borrower_id     INTEGER NOT NULL,
    borrow_date     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date     DATETIME NULL,
    FOREIGN KEY (book_id)     REFERENCES books(book_id)     ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES borrowers(borrower_id) ON DELETE CASCADE
);
CREATE INDEX idx_tx_book     ON transactions(book_id);
CREATE INDEX idx_tx_borrower ON transactions(borrower_id);
CREATE INDEX idx_tx_open     ON transactions(return_date) WHERE return_date IS NULL;
