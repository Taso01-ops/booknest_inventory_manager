import React from 'react';
import API from './api';

const Cart = ({ cartItems, setCartItems }) => {
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required to place order.');

    try {
      await API.post('/orders', {
        items: cartItems.map(item => ({
          book_id: item.id,
          quantity: item.quantity || 1,
        })),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Order placed successfully!');
      setCartItems([]); // Clear cart after successful order
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.title} - ${item.price} x {item.quantity || 1}
              </li>
            ))}
          </ul>
          <button onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
