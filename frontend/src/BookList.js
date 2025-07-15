import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]); // To store all books
  const [searchQuery, setSearchQuery] = useState(''); // To store search input

  // Fetch all books initially
  useEffect(() => {
    axios.get('http://localhost:3001/books') // Adjust this URL to your API
      .then((res) => {
        setBooks(res.data); // Update books state with all books
      })
      .catch((err) => console.error('Failed to load books:', err));
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      // If the search query is empty, fetch all books again
      axios.get('http://localhost:3001/books')
        .then((res) => setBooks(res.data))
        .catch((err) => console.error('Failed to load books:', err));
    } else {
      // If there's a search query, filter by title
      axios.get(`http://localhost:3001/books/search/${searchQuery}`)
        .then((res) => setBooks(res.data)) // Update books state with filtered books
        .catch((err) => console.error('Search failed:', err));
    }
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      // Remove the deleted book from the list
      setBooks(books.filter(book => book.OrderID !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div>
      <h2>Book List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search books by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery as user types
      />
      <button onClick={handleSearch}>Search</button>

      {/* Book List */}
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
