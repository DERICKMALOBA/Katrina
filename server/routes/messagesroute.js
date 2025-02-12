const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
router.get("/messageslist", (req, res) => {
  const query = "SELECT * FROM chats";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ error: "Error fetching messages" });
    }
    res.json(results);
  });
});
router.post("/messagessend", (req, res) => {
  const { text, sender } = req.body;
 var admin=0;
  const query = "INSERT INTO chats (name, customermsg,replied) VALUES (?,?,?)";
  db.query(query, [sender, text,admin], (err, result) => {
    if (err) {
      console.error("Error inserting message:", err);
      return res.status(500).json({ error: "Error sending message" });
    }

    const newMessage = {
      id: result.insertId,
      name: sender,
      customermsg: text,
    };
  });
});
router.post("/reply", (req, res) => {
  const {text,messageId} = req.body;
  var adminreply=1;
  const query = "UPDATE chats SET adminmsg = ?,replied=? WHERE id = ?";
  db.query(query, [text,adminreply,messageId], (err, result) => {
    if (err) {
      console.error("Error updating admin reply:", err);
      return res.status(500).json({ error: "Error replying to message" });
    }

  });
});
router.get("/messageslist/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const query = "SELECT*FROM chats WHERE id=?";
  db.query(query,id, (err, result) => {
    if (err) {
      console.error("Error updating admin reply:", err);
      return res.status(500).json({ error: "Error replying to message" });
    }
    res.send(result);
  });
});
module.exports = router;
