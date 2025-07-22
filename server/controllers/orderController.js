const db = require('../db');

exports.placeOrder = (req, res) => {
  const customerId = req.user.userId;
  const items = req.body.items; // [{ book_id, quantity }, ...]

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  const orderDate = new Date();

  // 1. Create the order
  db.query(
    'INSERT INTO orders (customer_id, order_date) VALUES (?, ?)',
    [customerId, orderDate],
    (err, orderResult) => {
      if (err) return res.status(500).json({ message: 'Order creation failed', error: err });

      const orderId = orderResult.insertId;

      // 2. Insert into order_items
      const orderItemsValues = items.map(item => [orderId, item.book_id, item.quantity]);

      db.query(
        'INSERT INTO order_items (order_id, book_id, quantity) VALUES ?',
        [orderItemsValues],
        (itemsErr) => {
          if (itemsErr) return res.status(500).json({ message: 'Order items failed', error: itemsErr });

          // 3. Update stock (safely)
          const stockUpdates = items.map(item => {
            return new Promise((resolve, reject) => {
              const stockQuery = 'UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?';
              db.query(stockQuery, [item.quantity, item.book_id, item.quantity], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error('Insufficient stock'));
                resolve();
              });
            });
          });

          Promise.all(stockUpdates)
            .then(() => {
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


