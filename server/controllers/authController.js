const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');

exports.register = (req, res) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !phone || !address || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  findUserByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    createUser({ name, email, phone, address, password }, (err, result) => {
      if (err) return res.status(500).json({ error: "Registration failed", details: err });

      const id = result.insertId;
      const token = jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ message: "User registered", token });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  findUserByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length === 0) return res.status(401).json({ error: "User not found" });

    const user = users[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });
  });
};

