// Use this instead of /search/:title
app.get('/books/search', (req, res) => {
  const title = req.query.title;
  db.query("SELECT * FROM books WHERE LOWER(title) LIKE LOWER(?)", [`%${title}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

