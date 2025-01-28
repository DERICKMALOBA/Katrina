import db from '../config/db.js';

// Create a new user (for sign-up)
const createUser = (phone, name, email, password, callback) => {
  const query = 'INSERT INTO customers (phone, name, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [phone, name, email, password], callback);
};

// Get a user by email (for sign-in)
const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM customers WHERE email = ?';
  db.query(query, [email], callback);
};

export default { createUser, getUserByEmail };
