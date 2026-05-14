import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/transactionService";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e?.message || "Failed to load stats"));
  }, []);

  if (error) return <div className="error-banner">{error}</div>;
  if (!stats) return <div className="loading">Loading dashboard…</div>;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Library overview and recent activity</p>

      <div className="stat-grid">
        <StatCard label="Total Books" value={stats.total_books} accent="accent-blue" />
        <StatCard label="Available" value={stats.available_books} accent="accent-green" />
        <StatCard label="Borrowed" value={stats.borrowed_books} accent="accent-amber" />
        <StatCard label="Borrowers" value={stats.total_borrowers} accent="accent-purple" />
        <StatCard label="Active Loans" value={stats.active_transactions} accent="accent-red" />
      </div>

      <h2 className="section-title">Recent Transactions</h2>
      {stats.recent_transactions.length === 0 ? (
        <p className="muted">No transactions yet — head over to Borrow / Return to record one.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>Borrower</th>
              <th>Borrowed</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_transactions.map((t) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
