import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { getBooks } from "../services/bookService";
import { getBorrowers } from "../services/borrowerService";
import {
  borrowBook,
  returnBook,
  getTransactions,
} from "../services/transactionService";

export default function TransactionsPage() {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bookId, setBookId] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [toast, setToast] = useState({ message: "" });

  const refresh = async () => {
    try {
      const [b, br, t] = await Promise.all([getBooks(), getBorrowers(), getTransactions()]);
      setBooks(b);
      setBorrowers(br);
      setTransactions(t);
    } catch (e) {
      setToast({ message: e?.message || "Failed to refresh", type: "error" });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!bookId || !borrowerId) {
      setToast({ message: "Select a book and a borrower", type: "error" });
      return;
    }
    try {
      await borrowBook(parseInt(bookId, 10), parseInt(borrowerId, 10));
      setToast({ message: "Book borrowed successfully", type: "success" });
      setBookId("");
      setBorrowerId("");
      refresh();
    } catch (e) {
      setToast({ message: e?.response?.data?.detail || "Borrow failed", type: "error" });
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      setToast({ message: "Book returned", type: "success" });
      refresh();
    } catch (e) {
      setToast({ message: e?.response?.data?.detail || "Return failed", type: "error" });
    }
  };

  const availableBooks = books.filter((b) => b.availability_status === "Available");

  return (
    <div className="page">
      <h1 className="page-title">Borrow / Return</h1>
      <p className="page-subtitle">Record loans and returns</p>

      <div className="card">
        <h2 className="section-title">Borrow a Book</h2>
        <form className="form-inline" onSubmit={handleBorrow}>
          <div className="form-group">
            <label>Book</label>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">-- Select an available book --</option>
              {availableBooks.map((b) => (
                <option key={b.book_id} value={b.book_id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Borrower</label>
            <select value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)}>
              <option value="">-- Select a borrower --</option>
              {borrowers.map((b) => (
                <option key={b.borrower_id} value={b.borrower_id}>
                  {b.borrower_name} ({b.email})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Borrow</button>
        </form>
      </div>

      <h2 className="section-title">Transaction History</h2>
      {transactions.length === 0 ? (
        <div className="empty-state">No transactions yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>Borrower</th>
              <th>Borrowed</th>
              <th>Returned</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.transaction_id}>
                <td>{t.transaction_id}</td>
                <td>{t.book_title}</td>
                <td>{t.borrower_name}</td>
                <td>{new Date(t.borrow_date).toLocaleString()}</td>
                <td>
                  {t.return_date ? (
                    new Date(t.return_date).toLocaleString()
                  ) : (
                    <span className="badge badge-amber">On loan</span>
                  )}
                </td>
                <td>
                  {!t.return_date && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleReturn(t.transaction_id)}>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Toast {...toast} onClose={() => setToast({ message: "" })} />
    </div>
  );
}
