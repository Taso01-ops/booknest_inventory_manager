import React from 'react';
import axios from 'axios';

const BookList = ({ books, setBooks }) => {

  const handleDelete = async (id) => {
    try {
      // Correct the DELETE URL by using backticks
      await axios.delete(`http://localhost:3001/books/${id}`);
      
      // Filter out the deleted book from the list
      setBooks(books.filter(book => book.OrderID !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books.length === 0 ? (
          <p>No books available</p>
        ) : (
          books.map((book) => (
            <li key={book.OrderID}>
              {book.Title} — ${book.Price}
              <button onClick={() => handleDelete(book.OrderID)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BookList;
