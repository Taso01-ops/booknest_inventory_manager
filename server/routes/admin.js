const express = require('express');
const router = express.Router();
const { adminLogin, addBook, deleteBook, updateBook } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken'); // Optional: add admin verification

router.post('/login', adminLogin);
router.post('/books', verifyToken, addBook);
router.delete('/books/:id', verifyToken, deleteBook);
router.put('/books/:id', verifyToken, updateBook);

module.exports = router;

