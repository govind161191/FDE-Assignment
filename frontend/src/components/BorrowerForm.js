import React, { useState, useEffect } from "react";

const empty = { borrower_name: "", email: "", phone: "" };

export default function BorrowerForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty);
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.borrower_name.trim()) e.borrower_name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
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
        <label>Borrower Name *</label>
        <input value={form.borrower_name} onChange={handleChange("borrower_name")} />
        {errors.borrower_name && <span className="form-error">{errors.borrower_name}</span>}
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input type="email" value={form.email} onChange={handleChange("email")} />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Phone *</label>
        <input value={form.phone} onChange={handleChange("phone")} />
        {errors.phone && <span className="form-error">{errors.phone}</span>}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
