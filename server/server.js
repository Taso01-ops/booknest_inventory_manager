require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const titleSearch = require('./titleSearch');
const { verifyToken, verifyAdmin } = require('./middleware/verifyToken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/books', titleSearch); 

//---------------------------------------
app.post('/books', (req, res) => {
  const { isbn, title, price, publication_year, stock, category } = req.body;
  const sql = `INSERT INTO books (isbn, title, price, publication_year, stock, category) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [isbn, title, price, publication_year, stock, category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  });
});

//---------------------------------------
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

//---------------------------------------
app.put('/books/:id', (req, res) => {
  const { title, price, stock } = req.body;
  const sql = `UPDATE books SET title = ?, price = ?, stock = ? WHERE id = ?`;
  db.query(sql, [title, price, stock, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Book updated' });
  });
});

//---------------------------------------
app.delete('/books/:id', (req, res) => {
  db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Book deleted' });
  });
});

//---------------------------------------
app.post('/orders', verifyToken, (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  const insertOrderSql = 'INSERT INTO orders (customer_id, order_date) VALUES (?, NOW())';
  db.query(insertOrderSql, [userId], (err, orderResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const orderId = orderResult.insertId;

    const insertItemsSql = 'INSERT INTO order_items (order_id, book_id, quantity) VALUES ?';
    const itemValues = items.map(i => [orderId, i.bookId, i.quantity]);

    db.query(insertItemsSql, [itemValues], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const updates = items.map(i => {
        return new Promise((resolve, reject) => {
          db.query('UPDATE books SET stock = stock - ? WHERE id = ?', [i.quantity, i.bookId], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      Promise.all(updates)
        .then(() => res.status(201).json({ message: 'Order placed successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
    });
  });
});

//---------------------------------------
app.get('/orders', verifyToken, (req, res) => {
  const sql = `
    SELECT o.id AS order_id, o.order_date, b.title, oi.quantity, b.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN books b ON b.id = oi.book_id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//---------------------------------------
// Admin Routes
app.post('/admin/books', verifyAdmin, (req, res) => {
  const { isbn, title, price, publication_year, stock, category } = req.body;
  const sql = `INSERT INTO books (isbn, title, price, publication_year, stock, category) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [isbn, title, price, publication_year, stock, category];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Book added by admin', bookId: result.insertId });
  });
});

app.put('/admin/books/:id', verifyAdmin, (req, res) => {
  const { price, stock } = req.body;
  const sql = `UPDATE books SET price = ?, stock = ? WHERE id = ?`;
  db.query(sql, [price, stock, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Book updated by admin' });
  });
});

app.delete('/admin/books/:id', verifyAdmin, (req, res) => {
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Book deleted by admin' });
  });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const admin = results[0];

    if (password !== admin.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

//---------------------------------------
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📦 Server is running on port ${PORT}`);
});
