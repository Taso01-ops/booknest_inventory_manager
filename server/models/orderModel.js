const db = require('../db');

exports.createOrder = (userId, items, callback) => {
  const date = new Date();

  db.query(
    'INSERT INTO orders (customer_id, order_date) VALUES (?, ?)',
    [userId, date],
    (err, result) => {
      if (err) return callback(err);

      const orderId = result.insertId;

      const values = items
        .filter(item => item.book_id && item.quantity)
        .map(item => [orderId, item.book_id, item.quantity]);

      if (values.length === 0) {
        return callback(new Error('No valid items to insert.'));
      }

      db.query(
        'INSERT INTO order_items (order_id, book_id, quantity) VALUES ?',
        [values],
        (err2) => {
          if (err2) return callback(err2);

          // Step 4: Reduce stock for each item
          const updateTasks = values.map(([_, bookId, qty]) => {
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [qty, bookId, qty],
                (err3, result3) => {
                  if (err3) return reject(err3);
                  if (result3.affectedRows === 0) {
                    return reject(new Error(`Insufficient stock for book ID ${bookId}`));
                  }
                  resolve();
                }
              );
            });
          });

          Promise.all(updateTasks)
            .then(() => callback(null))
            .catch(callback);
        }
      );
    }
  );
};

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

