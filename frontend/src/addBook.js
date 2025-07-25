import React, { useState } from 'react';
import API from './api';

function AddBook({ onSuccess }) {
  const [book, setBook] = useState({
    title: '', price: '', stock: '', isbn: '', publication_year: '', category: ''
  });

  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/books', book).then(() => {
      alert('Book added');
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {['title', 'price', 'stock', 'isbn', 'publication_year', 'category'].map(field => (
        <input key={field} name={field} placeholder={field} onChange={handleChange} required />
      ))}
      <button type="submit">Add Book</button>
    </form>
  );
}

export default AddBook;


