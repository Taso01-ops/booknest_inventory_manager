import React, { useState, useEffect } from 'react';
import BookList from './BookList';
import SearchBar from './SearchBar';
import AddBook from './AddBook'; // If you plan to use this
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Book Inventory</h1>
      <SearchBar setBooks={setBooks} />
      <BookList books={books} setBooks={setBooks} />
      <AddBook onSuccess={fetchBooks} />
    </div>
  );
};

export default App;
