import React, { useState, useEffect } from 'react';
import API from './api';

function EditBook({ book, onSuccess }) {
  const [form, setForm] = useState(book);

  useEffect(() => { setForm(book); }, [book]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    API.put(`/books/${book.id}`, form).then(() => {
      alert('Book updated');
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {['title', 'price', 'stock'].map(field => (
        <input key={field} name={field} value={form[field]} onChange={handleChange} required />
      ))}
      <button type="submit">Save</button>
    </form>
  );
}

export default EditBook;

