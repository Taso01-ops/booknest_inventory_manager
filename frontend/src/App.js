import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import Login from './Login';
import AdminDashboard from './AdminDashboard';
import SearchBar from './SearchBar';
import BookList from './BookList';
import AddBook from './addBook';
import UpdateBook from './updateBook';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  // Decode token to get role
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setRole(decoded.role || 'user'); // fallback to 'user' if role isn't in token
      } catch {
        setRole(null);
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  // Fetch books for regular users
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  useEffect(() => {
    if (role === 'user') {
      fetchBooks();
    }
  }, [role]);

  // No token? Show login
  if (!token) return <Login setToken={setToken} />;

  // Admin? Show Admin Dashboard
  if (role === 'admin') return <AdminDashboard onLogout={logout} />;

  // Regular user view
    // Regular user view
  return (
    <div>
      <h1>📚 Book Inventory (User View)</h1>
      <button onClick={logout}>Logout</button>

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
