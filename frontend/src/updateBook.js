import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteButton from './DeleteButton'; // Import the DeleteButton component

function UpdateBook({ book, onSuccess }) {
  const [form, setForm] = useState({
    title: '', author_name: '', price: '', stock: ''
  });

  useEffect(() => {
    if (book) {
      setForm(book);
    }
  }, [book]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/books/${book.id}`, form)
      .then(() => {
        alert('Book updated');
        onSuccess?.();
      });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      axios.delete(`http://localhost:3001/books/${book.id}`)
        .then(() => {
          alert('Book deleted');
          onSuccess?.();
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {['title','price', 'stock'].map(field => (
        <input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={field}
          required
        />
      ))}
      <button type="submit">Update Book</button>

      {/* Using DeleteButton here */}
      <DeleteButton onDelete={handleDelete} />
    </form>
  );
}

export default UpdateBook;
