const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
router.get('/userslist', (req, res) => {

  const query = 'SELECT*FROM customers';

  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length>=1) {
       res.send(results);
    }
  });
});
router.post('/deleteusers', (req, res) => {
  const {userid}=req.body;
    const query = 'DELETE FROM customers WHERE userid=?';
    const ui=userid;
    console.log(ui);
    db.query(query,ui,async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
  
      if (results.length>=1) {
          console.log(results);
         res.send(results);
      }
    });
  });
  router.get('/userstotal', (req, res) => {
      const query = 'SELECT*FROM customers';
      db.query(query,async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        const t = results.length;
        console.log(t);
        res.json({size:t});
      });
    });
    router.get('/newusers', (req, res) => {
        const m= new Date().getMonth() + 1; 
        const y = new Date().getFullYear();
        const dt=[m,y];
        console.log(m);
        console.log(y);
        const query = 'SELECT*FROM customers WHERE month=?&&year=?';
        db.query(query,dt,async (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          const nn = results.length;
          console.log(nn);
          res.json({new:nn});
        });
      });
module.exports = router;