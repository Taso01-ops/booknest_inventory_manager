const { createOrder, getOrdersByCustomerId } = require('../models/orderModel');

exports.placeOrder = (req, res) => {
  const customerId = req.user.userId;
  const items = req.body.items;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  createOrder(customerId, items, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Order failed', error: err.message });
    }

    res.status(201).json({ message: 'Order placed successfully' });
  });
};

exports.getOrderHistory = (req, res) => {
  const customerId = req.user.userId;

  getOrdersByCustomerId(customerId, (err, orders) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch order history', error: err });

    res.json(orders);
  });
};
