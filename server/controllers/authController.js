const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../models/userModel');

exports.register = (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  findUserByEmail(email, (err, users) => {
    if (users.length > 0) return res.status(409).json({ error: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    createUser({ name, email, phone, address, password: hashedPassword }, (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "User registered" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, users) => {
    if (users.length === 0) return res.status(401).json({ error: "User not found" });

    const user = users[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

