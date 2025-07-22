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

        // Group by order ID
        const grouped = res.data.reduce((acc, item) => {
          const { id, order_date, title, quantity, price } = item;
          if (!acc[id]) {
            acc[id] = { order_date, items: [] };
          }
          acc[id].items.push({ title, quantity, price });
          return acc;
        }, {});

        setOrders(grouped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {Object.keys(orders).length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        Object.entries(orders).map(([orderId, order]) => (
          <div key={orderId}>
            <h4>Order #{orderId} ({order.order_date.split('T')[0]})</h4>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.title} x {item.quantity} @ ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
