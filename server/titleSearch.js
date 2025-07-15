app.get('/books/search/:title', (req, res) => {
  const title = req.params.title;
  db.query("SELECT * FROM books WHERE title LIKE ?", [`%${title}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

