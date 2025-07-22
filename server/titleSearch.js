const express = require('express'); 
const router = express.Router();
const db = require('./db');

router.get('/search', (req, res) => {
  const { title, minPrice, maxPrice } = req.query;

  let sql = "SELECT * FROM books WHERE 1=1";
  const params = [];

  if (title) {
    sql += " AND LOWER(title) LIKE LOWER(?)";
    params.push(`%${title}%`);
  }

  if (minPrice) {
    sql += " AND price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    sql += " AND price <= ?";
    params.push(maxPrice);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;


