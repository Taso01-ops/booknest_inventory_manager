import React from 'react';
import DeleteButton from './DeleteButton';
import API from './api';

const BookList = ({ books, setBooks, onEdit, addToCart }) => {
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
          
          {onEdit && (
            <>
              <DeleteButton onDelete={() => handleDelete(book.id)} />
              <button onClick={() => onEdit(book)}>Edit</button>
            </>
          )}

          {addToCart && (
            <button onClick={() => addToCart(book)}>Add to Cart</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default BookList;




