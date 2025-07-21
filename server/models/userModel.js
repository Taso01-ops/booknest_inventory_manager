const db = require('../db');

const createUser = (user) => {
  const sql = 'INSERT INTO customers (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)';
  return db.promise().execute(sql, [user.name, user.email, user.phone, user.address, user.password]);
};

const findUserByEmail = (email) => {
  const sql = 'SELECT * FROM customers WHERE email = ?';
  return db.promise().execute(sql, [email]);
}; 
