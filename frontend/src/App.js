import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './BookList';  
import SearchBar from './SearchBar';  
import AddBook from './addBook';  
import UpdateBook from './updateBook';  
import API from './api'; // Add this

const App = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);  // This is correct

  // Fetch books from the API
  const fetchBooks = async () => {
    const res = await API.get('/books');
    try {
      const res = await axios.get('http://localhost:3001/books');
      console.log(res.data);  // Log the data to verify it's fetched correctly
      setBooks(res.data);  // Set the books state
    } catch (err) {
      console.error('Failed to fetch books', err);  // Error handling if fetch fails
    }
  };

  useEffect(() => {
    fetchBooks();  // Call fetchBooks when the component mounts
  }, []);  // Empty dependency array ensures it runs once on mount

  return (
    <div>
      <h1>Book Inventory</h1>
      
      {/* Search bar component */}
      <SearchBar setBooks={setBooks} />

      {/* Book list component */}
      <BookList books={books} setBooks={setBooks} onEdit={setEditingBook} />

      {/* Add book component */}
      <AddBook onSuccess={fetchBooks} />

      {/* Conditionally render the UpdateBook component if editingBook is set */}
      {editingBook && (
        <div>
          <UpdateBook
            book={editingBook}  // Pass the selected book to UpdateBook
            onSuccess={() => {
              setEditingBook(null);  // Clear editingBook after success
              fetchBooks();  // Refresh the book list after update
            }}
          />
          {/* Cancel editing action */}
          <button onClick={() => setEditingBook(null)}>Cancel Edit</button>
        </div>
      )}
    </div>
  );
};

export default App;

