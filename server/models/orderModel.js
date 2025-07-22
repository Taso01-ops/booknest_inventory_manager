const db = require('../db');

exports.createOrder = (userId, items, callback) => {
  const date = new Date();
  db.query('INSERT INTO orders (customer_id, order_date) VALUES (?, ?)', [userId, date], (err, result) => {
    if (err) return callback(err);

    const orderId = result.insertId;

    const values = items.map(item => [orderId, item.book_id, item.quantity]);

    console.log('Inserting order_items:', values); // DEBUG

    db.query('INSERT INTO order_items (order_id, book_id, quantity) VALUES ?', [values], callback);
  });
};


exports.getOrdersByCustomerId = (customerId, callback) => {
  db.query(`
    SELECT o.id, o.order_date, b.title, b.price, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN books b ON oi.book_id = b.id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `, [customerId], callback);
};

