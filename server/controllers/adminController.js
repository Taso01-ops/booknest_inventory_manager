const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (results.length === 0) return res.status(401).json({ error: 'Admin not found' });

    const admin = results[0];
    const match = bcrypt.compareSync(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });
};

exports.addBook = (req, res) => {
  const { isbn, title, price, publication_year, stock, category } = req.body;
  db.query(`INSERT INTO books (isbn, title, price, publication_year, stock, category) VALUES (?, ?, ?, ?, ?, ?)`,
    [isbn, title, price, publication_year, stock, category],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Book added' });
    });
};

exports.deleteBook = (req, res) => {
  db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Book deleted' });
  });
};

exports.updateBook = (req, res) => {
  const { price, stock } = req.body;
  db.query('UPDATE books SET price = ?, stock = ? WHERE id = ?', [price, stock, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Book updated' });
  });
};

