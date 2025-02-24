const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
router.get("/messageslist", (req, res) => {
  const query = "SELECT DISTINCT email,name,replied FROM chats WHERE role=? ORDER BY time DESC";
  db.query(query,"customer",(err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ error: "Error fetching messages" });
    }
    res.json(results);
  });
});
module.exports = router;
