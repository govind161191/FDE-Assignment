import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import BorrowersPage from "./pages/BorrowersPage";
import TransactionsPage from "./pages/TransactionsPage";
import SearchPage from "./pages/SearchPage";
import ETLPage from "./pages/ETLPage";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/borrowers" element={<BorrowersPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/etl" element={<ETLPage />} />
          <Route path="*" element={<div className="page"><h1>404 – Page not found</h1></div>} />
        </Routes>
      </main>
      <footer className="footer">
        AFDE Capstone Phase 1 — Library Management System • Built by Govind
      </footer>
    </div>
  );
}
