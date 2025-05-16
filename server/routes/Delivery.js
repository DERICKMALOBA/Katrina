const express = require('express');
const deliverRouter = express.Router();
const db = require('../config/db'); // MySQL database connection

// Middleware for admin check


// Fetch all delivery data
deliverRouter.get('/all', (req, res) => {
  const query = 'SELECT * FROM delivery';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

deliverRouter.put('/update/:id',  (req, res) => {
  const { id } = req.params;
  const { delivery_fee } = req.body;

  if (isNaN(delivery_fee)) {
    return res.status(400).json({ error: 'Delivery fee must be a number' });
  }

  const query = 'UPDATE delivery SET delivery_fee = ? WHERE id = ?';
  
  db.query(query, [delivery_fee, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Delivery record not found' });
    }

    res.status(200).json({ message: 'Delivery fee updated successfully' });
  });
});
deliverRouter.put("/update-data", (req, res) => {
  const { county, cityFees, cityVehicles } = req.body;

  if (!county || !cityFees || !cityVehicles) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updatePromises = Object.keys(cityFees).map((city) => {
    const query = `
      UPDATE delivery
      SET delivery_fee = ?, delivery_vehicle = ?
      WHERE county_name = ? AND city_name = ?`;

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [cityFees[city], JSON.stringify(cityVehicles[city]), county, city],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => res.status(200).json({ message: "Delivery data updated successfully!" }))
    .catch((error) => {
      console.error("Error updating delivery data:", error);
      res.status(500).json({ error: "Database error" });
    });
});

module.exports = deliverRouter;
