const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db.js');


dotenv.config(); // Load environment variables

// SIGNUP ROUTE
const signUp = async (req, res) => {
  const { name, email, phone, password, role = "customer" } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const checkQuery = "SELECT * FROM customers WHERE email = ? OR phone = ?";
    db.query(checkQuery, [email, phone], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const insertQuery = "INSERT INTO customers (name, email, phone, password,role) VALUES (?, ?, ?, ?, ?)";

      db.query(insertQuery, [name, email, phone, hashedPassword,role], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        // Generate JWT Token
        const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(201).json({ message: "Successfully registered", token });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Error processing request" });
  }
};




const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const query = "SELECT * FROM customers WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      // Correct password comparison
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Sign-in successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Error processing request" });
  }
};

module.exports = { signUp, signIn };
