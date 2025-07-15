import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = ({ books, setBooks }) => {
  // Local state for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all books when component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/books')  // Ensure this endpoint is correct
      .then((res) => {
        setBooks(res.data); // Store the fetched books into state
      })
      .catch((err) => console.error('Failed to load books:', err));
  }, [setBooks]);

  // Handle the search functionality
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/books/search/${searchQuery}`);
      setBooks(res.data); // Update the books state with the search results
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Handle the delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      setBooks(books.filter(book => book.OrderID !== id));  // Remove deleted book from the list
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div>
      <h2>Book List</h2>
      {/* Search input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query as user types
        placeholder="Search books by title"
      />
      <button onClick={handleSearch}>Search</button>  {/* Trigger search when clicked */}

      {/* Render the books */}
      <ul>
        {books.length === 0 ? (
          <p>No books available</p>  // Show a message if there are no books
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

