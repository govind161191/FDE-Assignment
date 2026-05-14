import React from "react";

/**
 * Compact KPI tile for the dashboard.
 */
export default function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card ${accent || ""}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
