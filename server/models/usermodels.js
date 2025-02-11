import db from '../config/db.js';

// Check if user exists by email or phone
const checkUserExists = (email, phone, callback) => {
  const query = 'SELECT * FROM customers WHERE email = ? OR phone = ?';
  db.query(query, [email, phone], callback);
};

// Create a new user
const createUser = (phone, name, email, password, role, callback) => {
  const query = 'INSERT INTO customers (phone, name, email, password, role) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [phone, name, email, password, role], callback);
};

// Get a user by email
const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM customers WHERE email = ?';
  db.query(query, [email], callback);
};

export { checkUserExists, createUser, getUserByEmail };
