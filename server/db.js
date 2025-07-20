const mysql = require('mysql2');
require('dotenv').config(); //env used here 

const port = process.env.PORT || 3001;

const db = mysql.createConnection({ //Basic DB connection params with a const port access just for simplicity. 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


db.connect((err) => { //Connection clauses
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = db; //export for us in other .js files
