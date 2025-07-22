import React, { useState } from 'react';
import DeleteButton from './DeleteButton';
import API from './api';

const BookList = ({ books, setBooks, onEdit }) => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (book) => {
    const exists = cart.find(item => item.book_id === book.id);
    if (exists) {
      setCart(cart.map(item =>
        item.book_id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { book_id: book.id, quantity: 1 }]);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.post('/orders', { items: cart }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed!');
      setCart([]);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order');
    }
  };

  const handleDelete = (id) => {
    API.delete(`/books/${id}`)
      .then(() => setBooks(books.filter(book => book.id !== id)))
      .catch((error) => console.error('Error deleting book:', error));
  };

  return (
    <div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} (${book.price})
            <button onClick={() => handleAddToCart(book)}>Add to Cart</button>
            <DeleteButton onDelete={() => handleDelete(book.id)} />
            <button onClick={() => onEdit(book)}>Edit</button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div>
          <h3>🛒 Cart</h3>
          <ul>
            {cart.map(item => {
              const book = books.find(b => b.id === item.book_id);
              return (
                <li key={item.book_id}>
                  {book?.title} x {item.quantity}
                </li>
              );
            })}
          </ul>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default BookList;
