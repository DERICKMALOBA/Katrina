const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.js');

const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
  const { name, email, phone, password, role = 'customer' } = req.body;  // Default role is 'customer'

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields (name, email, phone, password) are required' });
  }

  const checkQuery = 'SELECT * FROM customers WHERE email = ? OR phone = ?';
  db.query(checkQuery, [email, phone], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const m = new Date().getMonth() + 1;
    const y = new Date().getFullYear();
    const fq = [name, email, phone, hashedPassword, m, y, role]; // Add the role to the insert query
    const insertQuery = 'INSERT INTO customers (name, email, phone, password, month, year, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, fq, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      const token = jwt.sign({ id: result.insertId, email, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      const data = { message: 'Successfully registered' };
      console.log(data);  // Check the response
      res.json({ data, token });  // Send the token in response
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

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  

    res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role, token },
    });
  });
});



module.exports = router;