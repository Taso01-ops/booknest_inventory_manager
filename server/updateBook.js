

app.put('/books/:id', (req, res) => {
  const { title, isbn, price, publication_year, stock, author_name, category } = req.body;
  const sql = `UPDATE books SET title=?, isbn=?, price=?, publication_year=?, stock=?, author_name=?, category=? WHERE id=?`;
  db.query(sql, [title, isbn, price, publication_year, stock, author_name, category, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: \"Book updated\" });
  });
});

