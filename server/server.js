require('dotenv').config(); // Load env
const express = require('express');
const cors = require('cors');
const db = require('./db'); // use existing db.js

const app = express();
app.use(cors());
app.use(express.json());

//----------------------------------------------------------------

app.get('/books/search/:title', (req, res) => { //Provided search function
  const title = req.params.title;
  const sql = "SELECT * FROM books WHERE Title LIKE ?";
  db.query(sql, [`%${title}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

//----------------------------------------------------------------

app.post('/books', (req, res) => { //Post function to create a book
  const { isbn, title, price, publication_year, stock, category } = req.body;

  const sql = `
    INSERT INTO books (ISBN, Title, Price, Publication_Year, Stock, Category)
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
  const { title, author_name, price, stock } = req.body;
  const sql = `
    UPDATE books SET Title = ?, Author_Name = ?, Price = ?, Stock = ? WHERE id = ?
  `;
  const values = [title, author_name, price, stock, req.params.id];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Book updated" });
  });
});

