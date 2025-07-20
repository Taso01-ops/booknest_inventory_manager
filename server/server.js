require('dotenv').config(); // Load env
const express = require('express');
const cors = require('cors');
const db = require('./db'); // use existing db.js
const titleSearch = require('./titleSearch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(titleSearch); // register the routes from titleSearch.js
require('dotenv').config();
const authRoutes = require('./routes/auth');

//----------------------------------------------------------------

app.post('/books', (req, res) => { //Post function to create a book
  const { isbn, title, price, publication_year, stock, category } = req.body;

  const sql = `
    INSERT INTO books (isbn, title, price, publication_year, stock, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [isbn, title, price, publication_year, stock, category];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  });
});

//----------------------------------------------------------------

app.get('/books', (req, res) => { //Read function to list all books
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

//----------------------------------------------------------------

const PORT = process.env.PORT || 3001; //Starting server
app.listen(PORT, () => {
  console.log(`📦 Server is running on port ${PORT}`);
});

//----------------------------------------------------------------

app.delete('/books/:id', (req, res) => {
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Book deleted" });
  });
});

//----------------------------------------------------------------

app.put('/books/:id', (req, res) => {
  const { title, price, stock } = req.body;
  const sql = `
    UPDATE books SET title = ?, price = ?, stock = ? WHERE id = ?
  `;
  const values = [title, price, stock, req.params.id];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Book updated" });
  });
});

