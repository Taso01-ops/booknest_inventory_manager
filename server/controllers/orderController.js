const db = require('../db');
const { createOrder, getOrdersByCustomerId } = require('../models/orderModel');

exports.placeOrder = (req, res) => {
  const userId = req.user.userId;
  const items = req.body.items;

  // Deduct stock
  items.forEach(item => {
    db.query('UPDATE books SET stock = stock - ? WHERE id = ?', [item.quantity, item.book_id]);
  });

  createOrder(userId, items, (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Order placed' });
  });
};

exports.getUserOrders = (req, res) => {
  const userId = req.user.userId;
  getOrdersByCustomerId(userId, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

