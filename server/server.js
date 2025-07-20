require('dotenv').config(); // Load env variables

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db'); // DB connection
const titleSearch = require('./titleSearch');
const authRoutes = require('./routes/auth'); 
app.use(cors());
app.use(express.json());
app.use(titleSearch);           
app.use('/auth', authRoutes);    // For auth: /auth/register, /auth/login

//--------------------------------------------------

app.post('/books', (req, res) => {
  const { isbn, title, price, publication_year, stock, category } = req.body;
  const sql = `INSERT INTO books (isbn, title, price, publication_year, stock, category) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [isbn, title, price, publication_year, stock, category];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  });
});

app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.put('/books/:id', (req, res) => {
  const { title, price, stock } = req.body;
  const sql = `UPDATE books SET title = ?, price = ?, stock = ? WHERE id = ?`;
  const values = [title, price, stock, req.params.id];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Book updated" });
  });
});

app.delete('/books/:id', (req, res) => {
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Book deleted" });
  });
});

//--------------------------------------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📦 Server is running on port ${PORT}`);
});

