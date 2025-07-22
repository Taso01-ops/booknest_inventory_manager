import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import SearchBar from './SearchBar';
import BookList from './BookList';
import AddBook from './addBook';
import UpdateBook from './updateBook';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

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
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState('books'); // 'books', 'cart', 'orders'
  const [cartItems, setCartItems] = useState([]);

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

  const addToCart = (book) => {
    const exists = cartItems.find((item) => item.id === book.id);
    if (exists) {
      setCartItems(
        cartItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
    }
  };

  if (!token) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register setToken={setToken} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login setToken={setToken} />
            <p>
              Don’t have an account?{' '}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  if (role === 'admin') return <AdminDashboard onLogout={logout} />;

  // Customer view
  return (
    <div>
      <h1>📚 Book Store (Customer View)</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={() => setView('books')}>Browse Books</button>
      <button onClick={() => setView('cart')}>View Cart ({cartItems.length})</button>
      <button onClick={() => setView('orders')}>Order History</button>

      {view === 'books' && (
        <>
          <SearchBar setBooks={setBooks} />
          <BookList
            books={books}
            setBooks={setBooks}
            onEdit={setEditingBook}
            addToCart={addToCart}
          />
        </>
      )}

      {view === 'cart' && (
        <Cart cartItems={cartItems} setCartItems={setCartItems} />
      )}

      {view === 'orders' && <OrderHistory />}

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
