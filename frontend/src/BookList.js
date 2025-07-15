import React, { useEffect } from 'react';
import axios from 'axios';

const BookList = ({ books, setBooks }) => {
  useEffect(() => {
    axios.get('http://localhost:3001/books')
      .then((res) => setBooks(res.data))
      .catch((err) => console.error('Failed to load books:', err));
  }, [setBooks]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      setBooks(books.filter(book => book.OrderID !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.OrderID}>
            {book.Title} — ${book.Price}
            <button onClick={() => handleDelete(book.OrderID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
