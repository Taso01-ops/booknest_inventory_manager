import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './BookList';
import AddBook from './addBook';
import EditBook from './editBook';

const AdminDashboard = ({ onLogout }) => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>📘 Admin Dashboard</h2>
      <button onClick={onLogout}>Logout</button>

      <h3>📚 Add New Book</h3>
      <AddBook onSuccess={fetchBooks} />

      <h3>📖 Inventory</h3>
      <BookList books={books} setBooks={setBooks} onEdit={setEditingBook} />

      {editingBook && (
        <div>
          <h3>✏️ Edit Book</h3>
          <EditBook
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

export default AdminDashboard;
