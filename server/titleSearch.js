const express = require('express'); 
const router = express.Router();
const db = require('./db');

router.get('/search', (req, res) => { //Search from Proj 1
  const { title, minPrice, maxPrice } = req.query;

  if (!title) return res.status(400).json({ error: 'Missing title query' });

  let sql = "SELECT * FROM books WHERE LOWER(title) LIKE LOWER(?)";
  const params = [`%${title}%`];

  if (minPrice) { //Price range for proj 2
    sql += " AND price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    sql += " AND price <= ?";
    params.push(maxPrice);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

module.exports = router;
