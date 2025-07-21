const db = require('../db');

const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM customers WHERE email = ?', [email], callback);
};

const createUser = (user, callback) => {
  const { name, email, phone, address, password } = user;
  db.query(
    'INSERT INTO customers (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, address, password],
    callback
  );
};

module.exports = { findUserByEmail, createUser };

