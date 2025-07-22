const db = require('../db');

// Find a customer by email
const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM customers WHERE email = ?', [email], callback);
};

// Create a new customer
const createUser = (user, callback) => {
  const { name, email, phone, address, password } = user;
  db.query(
    'INSERT INTO customers (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, address, password],
    callback
  );
};

module.exports = { findUserByEmail, createUser };

