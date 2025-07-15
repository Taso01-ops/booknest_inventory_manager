import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteButton from './DeleteButton'; // We'll create this next

const BookList = ({ books, setBooks }) => {
  const [books, setBooks] = useState([]);

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Handle delete book
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.OrderID !== id)); // Remove deleted book from state
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
      });
  };

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.OrderID}>
            {book.Title} ({book.ISBN}) - ${book.Price}
            <DeleteButton onDelete={() => handleDelete(book.OrderID)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;

