const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = (req, res) => {
  const { name, email, password } = req.body;

  // Hash password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Password encryption failed' });

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Registration failed', detail: err });
      return res.status(201).json({ message: 'User registered' });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Login failed', detail: err });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Password check failed' });
      if (!match) return res.status(401).json({ error: 'Incorrect password' });

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ message: 'Login successful', token });
    });
  });
};

module.exports = { register, login };
 
