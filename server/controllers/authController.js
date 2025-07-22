const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

    const hashedPassword = bcrypt.hashSync(password, 10);
    createUser({ name, email, phone, address, password: hashedPassword }, (err, result) => {
      if (err) return res.status(500).json(err);

      const userId = result.insertId;
      const token = jwt.sign({ userId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });
  });
};
