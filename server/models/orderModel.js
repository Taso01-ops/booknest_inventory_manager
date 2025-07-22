const db = require('../db');

// Create new order
exports.createOrder = (customerId, items, callback) => {
  const date = new Date();

  db.query(
    'INSERT INTO orders (customer_id, order_date) VALUES (?, ?)',
    [customerId, date],
    (err, result) => {
      if (err) return callback(err);

      const orderId = result.insertId;

      const values = items.map(item => [orderId, item.book_id, item.quantity]);

      db.query(
        'INSERT INTO order_items (order_id, book_id, quantity) VALUES ?',
        [values],
        (err2) => {
          if (err2) return callback(err2);

          const stockUpdates = items.map(item => {
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [item.quantity, item.book_id, item.quantity],
                (err3, result3) => {
                  if (err3) return reject(err3);
                  if (result3.affectedRows === 0) {
                    return reject(new Error(`Insufficient stock for book ID ${item.book_id}`));
                  }
                  resolve();
                }
              );
            });
          });

          Promise.all(stockUpdates)
            .then(() => callback(null))
            .catch(callback);
        }
      );
    }
  );
};

// Get all orders for customer
exports.getOrdersByCustomerId = (customerId, callback) => {
  db.query(
    `
    SELECT o.id, o.order_date, b.title, b.price, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN books b ON oi.book_id = b.id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
    `,
    [customerId],
    callback
  );
};
