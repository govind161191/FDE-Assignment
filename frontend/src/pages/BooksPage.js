import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import BookForm from "../components/BookForm";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/bookService";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null); // null = closed, {} = create, {book} = edit
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    getBooks()
      .then(setBooks)
      .catch((e) => setToast({ message: e?.message || "Failed to load books", type: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const handleSubmit = async (form) => {
    try {
      if (editing && editing.book_id) {
        await updateBook(editing.book_id, form);
        setToast({ message: "Book updated", type: "success" });
      } else {
        await createBook(form);
        setToast({ message: "Book added", type: "success" });
      }
      setEditing(null);
      refresh();
    } catch (e) {
      setToast({ message: e?.response?.data?.detail || "Operation failed", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    try {
      await deleteBook(id);
      setToast({ message: "Book deleted", type: "success" });
      refresh();
    } catch (e) {
      setToast({ message: e?.response?.data?.detail || "Delete failed", type: "error" });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Book Management</h1>
          <p className="page-subtitle">Add, edit, and remove books from the catalog</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ Add Book</button>
      </div>

      {loading ? (
        <div className="loading">Loading books…</div>
      ) : books.length === 0 ? (
        <div className="empty-state">No books in the catalog yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.book_id}>
                <td>{b.book_id}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>{b.isbn}</td>
                <td>
                  <span className={"badge " + (b.availability_status === "Available" ? "badge-green" : "badge-amber")}>
                    {b.availability_status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm" onClick={() => setEditing(b)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.book_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={editing !== null}
        title={editing?.book_id ? "Edit Book" : "Add Book"}
        onClose={() => setEditing(null)}
      >
        <BookForm initial={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </Modal>

      <Toast {...toast} onClose={() => setToast({ message: "" })} />
    </div>
  );
}
