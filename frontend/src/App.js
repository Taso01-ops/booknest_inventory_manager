import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './BookList';
import SearchBar from './SearchBar';
import AddBook from './addBook';
import UpdateBook from './updateBook';

const App = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books');
      console.log(res.data); // Log to check if data is returned
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
      <BookList books={books} setBooks={setBooks} onEdit={setEditingBook} />
      <AddBook onSuccess={fetchBooks} />

      {editingBook && (
        <div>
          <UpdateBook
            book={editingBook}
            onSuccess={() => {
              setEditingBook(null);
              fetchBooks();
            }}
          />
          <button onClick={() => setEditingBook(null)}>Cancel Edit</button>
        </div>
      )}
    </div>
  );
};

export default App;
