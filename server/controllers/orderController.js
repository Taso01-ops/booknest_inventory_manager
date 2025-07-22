const db = require('../db');

exports.placeOrder = (req, res) => {
  const customerId = req.user.userId;
  const items = req.body.items;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  const orderDate = new Date();

  db.query(
    'INSERT INTO orders (customer_id, order_date) VALUES (?, ?)',
    [customerId, orderDate],
    (err, orderResult) => {
      if (err) return res.status(500).json({ message: 'Order creation failed', error: err });

      const orderId = orderResult.insertId;
      const orderItemsValues = items.map(item => [orderId, item.book_id, item.quantity]);

      db.query(
        'INSERT INTO order_items (order_id, book_id, quantity) VALUES ?',
        [orderItemsValues],
        (itemsErr) => {
          if (itemsErr) return res.status(500).json({ message: 'Order items failed', error: itemsErr });

          const stockUpdates = items.map(item => {
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [item.quantity, item.book_id, item.quantity],
                (err, result) => {
                  if (err) return reject(err);
                  if (result.affectedRows === 0) return reject(new Error(`Insufficient stock for book ID ${item.book_id}`));
                  resolve();
                }
              );
            });
          });

          Promise.all(stockUpdates)
            .then(() => res.status(201).json({ message: 'Order placed successfully', orderId }))
            .catch(stockErr => res.status(400).json({ message: 'Stock error', error: stockErr.message }));
        }
      );
    }
  );
};

exports.getOrderHistory = (req, res) => {
  const customerId = req.user.userId;

  db.query(
    `
    SELECT o.id AS order_id, o.order_date, b.title, b.price, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN books b ON oi.book_id = b.id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
    `,
    [customerId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch orders', error: err });

      res.status(200).json({ orders: results });
    }
  );
};
