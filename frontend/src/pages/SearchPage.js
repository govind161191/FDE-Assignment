import React, { useState } from "react";
import { searchBooks } from "../services/bookService";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (keyword) params.q = keyword;
      if (title) params.title = title;
      if (author) params.author = author;
      if (category) params.category = category;
      const data = await searchBooks(params);
      setResults(data);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword("");
    setTitle("");
    setAuthor("");
    setCategory("");
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">Search Books</h1>
      <p className="page-subtitle">Find books by keyword or filter by specific fields</p>

      <form className="card" onSubmit={handleSearch}>
        <div className="form-group">
          <label>Keyword (searches title, author, category, ISBN)</label>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. python, fiction, Martin..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
      </form>

      {loading && <div className="loading">Searching…</div>}

      {!loading && searched && (
        results.length === 0 ? (
          <div className="empty-state">No books matched your search.</div>
        ) : (
          <>
            <h2 className="section-title">{results.length} result{results.length !== 1 ? "s" : ""}</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((b) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      )}
    </div>
  );
}
