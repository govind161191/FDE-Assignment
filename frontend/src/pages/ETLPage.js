import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { getEtlSummary, downloadExport } from "../services/etlService";
import { getApiError } from "../utils/apiError";

const STAGES = [
  {
    id: "extract",
    label: "Extract",
    icon: "⬇",
    description: "Read raw records from the SQLite database tables.",
  },
  {
    id: "transform",
    label: "Transform",
    icon: "⚙",
    description:
      "Enrich transactions: join book & borrower info, calculate days borrowed, flag overdue loans (> 14 days).",
  },
  {
    id: "load",
    label: "Load",
    icon: "⬆",
    description: "Export the processed data as downloadable CSV files.",
  },
];

const EXPORTS = [
  { key: "books",        label: "Books",               icon: "📖", desc: "All catalogue records" },
  { key: "borrowers",    label: "Borrowers",            icon: "👤", desc: "All registered members" },
  { key: "transactions", label: "Transactions Report",  icon: "📋", desc: "Enriched loan history with derived fields" },
];

export default function ETLPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "" });

  const runExtract = () => {
    setLoading(true);
    getEtlSummary()
      .then((data) => {
        setSummary(data);
        setToast({ message: "Extract complete — data loaded from database", type: "success" });
      })
      .catch((e) => setToast({ message: getApiError(e, "Extract failed"), type: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(runExtract, []);

  const handleDownload = (key) => {
    try {
      downloadExport(key);
      setToast({ message: `Downloading ${key}.csv…`, type: "info" });
    } catch (e) {
      setToast({ message: getApiError(e, "Export failed"), type: "error" });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">ETL Pipeline</h1>
          <p className="page-subtitle">Extract · Transform · Load — export library data to CSV</p>
        </div>
        <button className="btn btn-primary" onClick={runExtract} disabled={loading}>
          {loading ? "Extracting…" : "Re-run Extract"}
        </button>
      </div>

      {/* Pipeline stage cards */}
      <div className="etl-stages">
        {STAGES.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`etl-stage-card${summary && s.id === "extract" ? " etl-stage-done" : ""}`}>
              <div className="etl-stage-icon">{s.icon}</div>
              <div className="etl-stage-label">{s.label}</div>
              <div className="etl-stage-desc">{s.description}</div>
            </div>
            {i < STAGES.length - 1 && <div className="etl-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>

      {/* Extract results */}
      {summary && (
        <>
          <h2 className="section-title">Extract Results</h2>
          <p className="muted" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
            Snapshot taken at {new Date(summary.extracted_at).toLocaleString()}
          </p>
          <div className="stat-grid">
            <div className="stat-card accent-blue">
              <div className="stat-value">{summary.tables.books.total}</div>
              <div className="stat-label">Books extracted</div>
              <div className="etl-sub">
                {summary.tables.books.available} available · {summary.tables.books.borrowed} borrowed
              </div>
            </div>
            <div className="stat-card accent-purple">
              <div className="stat-value">{summary.tables.borrowers.total}</div>
              <div className="stat-label">Borrowers extracted</div>
            </div>
            <div className="stat-card accent-amber">
              <div className="stat-value">{summary.tables.transactions.total}</div>
              <div className="stat-label">Transactions extracted</div>
              <div className="etl-sub">
                {summary.tables.transactions.active} active · {summary.tables.transactions.returned} returned
              </div>
            </div>
          </div>

          {/* Transform note */}
          <h2 className="section-title">Transform Rules</h2>
          <div className="card etl-transform-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Source</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>book_title</td><td>books.title</td><td>Join on book_id</td></tr>
                <tr><td>borrower_name</td><td>borrowers.borrower_name</td><td>Join on borrower_id</td></tr>
                <tr><td>borrower_email</td><td>borrowers.email</td><td>Join on borrower_id</td></tr>
                <tr><td>days_borrowed</td><td>borrow_date, return_date</td><td>return_date − borrow_date (today if still active)</td></tr>
                <tr><td>status</td><td>return_date</td><td>"Returned" if return_date set, else "Active"</td></tr>
                <tr><td>overdue</td><td>status, days_borrowed</td><td>"Yes" if Active and days_borrowed &gt; 14</td></tr>
              </tbody>
            </table>
          </div>

          {/* Load / export */}
          <h2 className="section-title">Load — Export CSV</h2>
          <div className="etl-export-grid">
            {EXPORTS.map((e) => (
              <div key={e.key} className="etl-export-card">
                <div className="etl-export-icon">{e.icon}</div>
                <div className="etl-export-label">{e.label}</div>
                <div className="etl-export-desc">{e.desc}</div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "auto", width: "100%" }}
                  onClick={() => handleDownload(e.key)}
                >
                  Download CSV
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <Toast {...toast} onClose={() => setToast({ message: "" })} />
    </div>
  );
}
