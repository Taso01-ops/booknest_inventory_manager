import React from 'react';
import API from './api';

const Cart = ({ cartItems, setCartItems }) => {
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required to place order.');

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          book_id: item.id, // Correct key for backend
          quantity: item.quantity || 1,
        })),
      };

      await API.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('✅ Order placed successfully!');
      setCartItems([]); // Clear cart after order
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('❌ Failed to place order. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + item.price * quantity;
    }, 0).toFixed(2);
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
                {item.title} - ${item.price} × {item.quantity || 1}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${calculateTotal()}</p>
          <button onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
