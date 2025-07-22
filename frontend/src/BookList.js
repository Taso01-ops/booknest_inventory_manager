import React from 'react';
import DeleteButton from './DeleteButton';
import API from './api';

const BookList = ({ books, setBooks, onEdit, isAdmin, addToCart }) => {
  const handleDelete = (id) => {
    API.delete(`/books/${id}`)
      .then(() => setBooks(books.filter((book) => book.id !== id)))
      .catch((error) => console.error('Error deleting book:', error));
  };

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          {book.title} ({book.isbn}) - ${book.price} | Stock: {book.stock}
          {isAdmin ? (
            <>
              <DeleteButton onDelete={() => handleDelete(book.id)} />
              <button onClick={() => onEdit(book)}>Edit</button>
            </>
          ) : (
            <button onClick={() => addToCart(book)}>Add to Cart</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default BookList;



