const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.js');
const nodemailer = require("nodemailer");
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
       var ar=[email,name];
       const Q = 'INSERT INTO chats (email,name) VALUES (?,?)';
       db.query(Q,ar,(err, result) => {
         if (err) {
           return res.status(500).json({ message: 'Database error', error: err });
         }
       });
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
       
      const data = { message: 'Successfully registered',Name:name,Email:email,Phone:phone,Role:role};
      console.log(data);  // Check the response
      res.json({  message: 'Successfully registered',Name:name,Email:email,Phone:phone,Role:role, token });  // Send the token in response
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
  
  var ar=JSON.parse(JSON.stringify(results));
    res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role, token },
      Name:ar[0].name,Email:ar[0].email,Phone:ar[0].phone,Role:ar[0].role
    });
  });
});
router.post('/forgot', async (req, res) => {
  const { Email} = req.body;  // Default role is 'customer'
console.log(Email);
  if (!Email) {
    return res.status(400).json({ message: 'All fields (name, email, phone, password) are required' });
  }

  const checkQuery = 'SELECT * FROM customers WHERE email = ?';
  db.query(checkQuery, [Email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    const size=results.length;
    console.log(size);
    if(size!=1)
    {
      res.json({message:0});
    }
    if(size==1)
    {
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: "mateilimo1@gmail.com",
    pass: "rkxd qgnq kscn wfpk",
  },
});
  try {
    const mailOptions = {
      from: "mateilimo1@gmail.com",
      to:Email,
      subject:"Sending mails to customers",
      text: "Dear customer reset your password by clicking this link:http://localhost:5173/resetpassword",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.json({message:1})
  } catch (error) {
    console.error("Error sending email:", error);
  }
    }
  });
});


module.exports = router;