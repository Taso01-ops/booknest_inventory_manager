// add book.js
import React, { useState } from 'react';
import axios from 'axios';

function AddBook({ onSuccess }) {
  const [book, setBook] = useState({
    title: '', price: '', stock: '', isbn: '', publication_year: '', category: ''
  });

  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/books', book).then(() => {
      alert('Book added');
      onSuccess?.();
    });
  };

return (
  <form onSubmit={handleSubmit}>
    {['title', 'isbn', 'price', 'publication_year', 'stock', 'category'].map(field => (
      <input
        key={field}
        name={field}
        placeholder={field}
        value={book[field]}
        onChange={handleChange}
        required
      />
    ))}
    <button type="submit">Add Book</button>
  </form>
);


export default AddBook;
