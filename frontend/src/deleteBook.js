app.delete('/books/:id', (req, res) => {
  db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Book deleted" });
  });
});
