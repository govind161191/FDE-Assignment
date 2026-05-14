import React, { useState, useEffect } from "react";

const empty = { title: "", author: "", category: "", isbn: "", availability_status: "Available" };

export default function BookForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty);
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.isbn.trim()) e.isbn = "ISBN is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Title *</label>
        <input value={form.title} onChange={handleChange("title")} />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label>Author *</label>
        <input value={form.author} onChange={handleChange("author")} />
        {errors.author && <span className="form-error">{errors.author}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <input value={form.category} onChange={handleChange("category")} />
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>
        <div className="form-group">
          <label>ISBN *</label>
          <input value={form.isbn} onChange={handleChange("isbn")} />
          {errors.isbn && <span className="form-error">{errors.isbn}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Availability</label>
        <select value={form.availability_status} onChange={handleChange("availability_status")}>
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
