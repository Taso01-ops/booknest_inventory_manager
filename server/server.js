require('dotenv').config(); // Load environment variables from .env file

const mysql = require('mysql2');

const db = mysql.createConnection({ //Database connection
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Failed!!', err.stack); //ERROR
    return;
  }
  console.log('Connected'); //APPROVED
});

module.exports = db; //export for use in API

