import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './BookList';
import SearchBar from './SearchBar';  // Import the SearchBar component

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all books when the component loads
    axios.get('http://localhost:3001/books')
      .then((res) => setBooks(res.data))
      .catch((err) => console.error('Failed to load books:', err));
  }, []);

  const handleSearch = (term) => {
    if (term) {
      // Fetch books based on the search term when the user types in the search bar
      axios.get(`http://localhost:3001/books/search/${term}`)
        .then((res) => setBooks(res.data))
        .catch((err) => console.error('Search failed:', err));
    } else {
      // If the search term is cleared, fetch all books again
      axios.get('http://localhost:3001/books')
        .then((res) => setBooks(res.data))
        .catch((err) => console.error('Failed to load books:', err));
    }
  };

  return (
    <div>
      <h1>Book Inventory</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
      <BookList books={books} setBooks={setBooks} />
    </div>
  );
};

export default App;
