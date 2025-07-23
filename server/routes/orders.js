const express = require('express');
const router = express.Router();
const { placeOrder, getOrderHistory } = require('../controllers/orderController'); // ✅ FIXED
const { verifyToken } = require('../middleware/verifyToken');

router.post('/', verifyToken, placeOrder);
router.get('/', verifyToken, getOrderHistory);

module.exports = router;
