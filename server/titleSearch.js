const express = require('express');
const router = express.Router();
const db = require('./db');

// SEARCH books by title (query param-based)
router.get('/books/search', (req, res) => {
  const title = req.query.title;

  if (!title) return res.status(400).json({ error: 'Missing title query' });

  const sql = "SELECT * FROM books WHERE LOWER(title) LIKE LOWER(?)";
  db.query(sql, [`%${title}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

module.exports = router;


