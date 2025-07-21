const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, placeOrder);
router.get('/', verifyToken, getUserOrders);

module.exports = router;

