import React from 'react';
import DeleteButton from './DeleteButton';
import API from './api'; // replace axios with API

const BookList = ({ books, setBooks, onEdit }) => {
  const handleDelete = (id) => {
    API.delete(`/books/${id}`)
      .then(() => setBooks(books.filter((book) => book.id !== id)))
      .catch((error) => console.error('Error deleting book:', error));
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



