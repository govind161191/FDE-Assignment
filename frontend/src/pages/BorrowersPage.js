import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import BorrowerForm from "../components/BorrowerForm";
import {
  getBorrowers,
  createBorrower,
  updateBorrower,
  deleteBorrower,
} from "../services/borrowerService";
import { getApiError } from "../utils/apiError";

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    getBorrowers()
      .then(setBorrowers)
      .catch((e) => setToast({ message: getApiError(e, "Failed to load"), type: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const handleSubmit = async (form) => {
    try {
      if (editing && editing.borrower_id) {
        await updateBorrower(editing.borrower_id, form);
        setToast({ message: "Borrower updated", type: "success" });
      } else {
        await createBorrower(form);
        setToast({ message: "Borrower added", type: "success" });
      }
      setEditing(null);
      refresh();
    } catch (e) {
      setToast({ message: getApiError(e, "Operation failed"), type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this borrower? This cannot be undone.")) return;
    try {
      await deleteBorrower(id);
      setToast({ message: "Borrower deleted", type: "success" });
      refresh();
    } catch (e) {
      setToast({ message: getApiError(e, "Delete failed"), type: "error" });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Borrower Management</h1>
          <p className="page-subtitle">Add, edit, and remove library members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ Add Borrower</button>
      </div>

      {loading ? (
        <div className="loading">Loading borrowers…</div>
      ) : borrowers.length === 0 ? (
        <div className="empty-state">No borrowers registered yet.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((b) => (
              <tr key={b.borrower_id}>
                <td>{b.borrower_id}</td>
                <td>{b.borrower_name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>
                  <button className="btn btn-sm" onClick={() => setEditing(b)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.borrower_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={editing !== null}
        title={editing?.borrower_id ? "Edit Borrower" : "Add Borrower"}
        onClose={() => setEditing(null)}
      >
        <BorrowerForm initial={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </Modal>

      <Toast {...toast} onClose={() => setToast({ message: "" })} />
    </div>
  );
}
