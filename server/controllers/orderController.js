const db = require('../db');

// Place order
exports.placeOrder = (req, res) => {
  console.log('📦 New order request received');

  const customerId = req.user?.id; // <-- fixed from userId to id
  const items = req.body.items;

  if (!customerId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  const orderDate = new Date();

  db.query(
    'INSERT INTO orders (customer_id, order_date) VALUES (?, ?)',
    [customerId, orderDate],
    (err, orderResult) => {
      if (err) {
        return res.status(500).json({ message: 'Order creation failed', error: err.message });
      }

      const orderId = orderResult.insertId;
      const orderItemsValues = items.map(item => [orderId, item.book_id, item.quantity]);

      db.query(
        'INSERT INTO order_items (order_id, book_id, quantity) VALUES ?',
        [orderItemsValues],
        (itemsErr) => {
          if (itemsErr) {
            return res.status(500).json({ message: 'Order items insertion failed', error: itemsErr.message });
          }

          const stockUpdates = items.map(item => {
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [item.quantity, item.book_id, item.quantity],
                (stockErr, result) => {
                  if (stockErr) return reject(stockErr);
                  if (result.affectedRows === 0) {
                    return reject(new Error(`Insufficient stock for book ID ${item.book_id}`));
                  }
                  resolve();
                }
              );
            });
          });

          Promise.all(stockUpdates)
            .then(() => {
              console.log(`✅ Order ${orderId} placed successfully`);
              res.status(201).json({ message: 'Order placed successfully', orderId });
            })
            .catch(stockErr => {
              res.status(400).json({ message: 'Stock error', error: stockErr.message });
            });
        }
      );
    }
  );
};

// Get order history
exports.getOrderHistory = (req, res) => {
  const customerId = req.user?.id; // <-- fixed from userId to id

  if (!customerId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }

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
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
      }

      res.status(200).json({ orders: results });
    }
  );
};
