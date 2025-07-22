import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Login from './Login';
import AdminDashboard from './AdminDashboard';
import SearchBar from './SearchBar';
import BookList from './BookList';
import AddBook from './addBook';
import UpdateBook from './updateBook';
import Register from './Register'; 

// Native token parser (no jwt-decode needed)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  // Decode token to get role
  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setRole(decoded.role || 'user');
      } else {
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

export default App;

