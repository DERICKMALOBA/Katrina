const express = require("express");
const checkoutRouter = express.Router();
const db = require("../config/db"); // Ensure you have a database connection file

// Route to handle order submission
checkoutRouter.post("/checkout", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      altPhoneNumber,
      address,
      county,
      city,
      deliveryVehicle,
      deliveryFee,
      paymentMethod,
      mpesaNumber,
      totalPrice,
      totalAmount,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !county ||
      !city ||
      !deliveryVehicle ||
      !deliveryFee ||
      !paymentMethod ||
      !totalPrice ||
      !totalAmount
    ) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    // Insert order into database
    const sql = `
      INSERT INTO checkout (
        firstName, lastName, phoneNumber, altPhoneNumber, address, county, city, 
        deliveryVehicle, deliveryFee, paymentMethod, mpesaNumber, totalPrice, totalAmount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      firstName,
      lastName,
      phoneNumber,
      altPhoneNumber || null,
      address,
      county,
      city,
      deliveryVehicle,
      deliveryFee,
      paymentMethod,
      mpesaNumber || null,
      totalPrice,
      totalAmount,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error saving order:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }
      res.status(201).json({ success: true, message: "Order submitted successfully!", orderId: result.insertId });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports =checkoutRouter ;
