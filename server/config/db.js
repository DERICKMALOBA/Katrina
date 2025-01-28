const mysql = require('mysql2');
require('dotenv').config(); // Load .env file

const db = mysql.createConnection({
  host: process.env.DB_HOST,           // Use host from .env
  user: process.env.DB_USER,           // Use user from .env
  password: process.env.DB_PASSWORD,   // Use password from .env
  database: process.env.DB_NAME,       // Use database name from .env
   // Use port from .env, default to 3306 if not set
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL Database');
  }
});

module.exports = db;