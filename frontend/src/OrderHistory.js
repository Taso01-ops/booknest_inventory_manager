import React, { useEffect, useState } from 'react';
import API from './api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await API.get('/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <ul>
          {orders.map((o, index) => (
            <li key={index}>
              {o.order_date.split('T')[0]} - {o.title} x {o.quantity} @ ${o.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
