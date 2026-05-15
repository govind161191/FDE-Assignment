import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/books", label: "Books" },
  { to: "/borrowers", label: "Borrowers" },
  { to: "/transactions", label: "Borrow / Return" },
  { to: "/search", label: "Search" },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon" aria-hidden="true" style={{ color: "#EA262A" }}>▶</span>
        <span className="brand-text">
          <span style={{ color: "#EA262A", fontWeight: 800 }}>Prodapt</span>
          <span style={{ color: "#fff", fontWeight: 500 }}> LMS</span>
        </span>
      </div>
      <ul className="navbar-links">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
