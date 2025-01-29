const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.js');

const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  console.log(name);
  console.log(phone);
  console.log(email);
  console.log(password);

  // Validate input
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields (name, email, phone, password) are required' });
  }

  // Check if the user already exists
  const checkQuery = 'SELECT * FROM customers WHERE email = ? OR phone = ?';
  db.query(checkQuery, [email, phone], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = 'INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)';

    db.query(insertQuery, [name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      // Create a JWT token for the user
      const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      const data = { message: 'Successfull registred'};
      res.json(data);
    });
  });
});

// Sign In Route
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM customers WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password);
    console.log(user.password);

    if (password!==user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).json({ success: true, user: { id: user.id, email: user.email, token } });
  });
});

module.exports = router;