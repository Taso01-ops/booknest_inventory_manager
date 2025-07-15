import React from 'react';
import DeleteButton from './DeleteButton';
import axios from 'axios';

const BookList = ({ books, setBooks }) => {
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/books/${id}`)
      .then(() => {
        // Remove the deleted book from the state
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
      });
  };

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          {book.title} ({book.isbn}) - ${book.price}
          <DeleteButton onDelete={() => handleDelete(book.id)} />
          <button onClick={() => onEdit(book)}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

export default BookList;

