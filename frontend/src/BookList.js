import React from 'react';
import DeleteButton from './DeleteButton';

const BookList = ({ books, setBooks, onEdit, addToCart }) => {
  const handleDelete = (id) => {
    fetch(`http://localhost:3001/books/${id}`, { method: 'DELETE' })
      .then(() => setBooks(books.filter(book => book.id !== id)))
      .catch((error) => console.error('Error deleting book:', error));
  };

  return (
    <div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} (${book.price})
            <button onClick={() => addToCart(book)}>Add to Cart</button>
            <DeleteButton onDelete={() => handleDelete(book.id)} />
            <button onClick={() => onEdit(book)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
