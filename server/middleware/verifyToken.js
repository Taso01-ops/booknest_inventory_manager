const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;

function verifyAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    req.admin = decoded;
    next();
  });
}

//-------------------- ADMIN ADD BOOK --------------------
app.post('/admin/books', verifyAdmin, (req, res) => {
  const { isbn, title, price, publication_year, stock, category } = req.body;
  const sql = `INSERT INTO books (isbn, title, price, publication_year, stock, category) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [isbn, title, price, publication_year, stock, category];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Book added by admin', bookId: result.insertId });
  });
});

//-------------------- ADMIN UPDATE BOOK --------------------
app.put('/admin/books/:id', verifyAdmin, (req, res) => {
  const { price, stock } = req.body;
  const sql = `UPDATE books SET price = ?, stock = ? WHERE id = ?`;
  db.query(sql, [price, stock, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Book updated by admin' });
  });
});

//-------------------- ADMIN DELETE BOOK --------------------
app.delete('/admin/books/:id', verifyAdmin, (req, res) => {
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Book deleted by admin' });
  });
});



