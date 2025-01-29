const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
router.get('/productslist', (req, res) => {

  const query = 'SELECT*FROM products';

  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length>=1) {
        console.log(results);
       res.send(results);
    }
  });
});

module.exports = router;