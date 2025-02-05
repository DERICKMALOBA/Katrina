const express = require("express");
const db = require("../config/db.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up static file serving
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where the files will be saved on the server
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Define the file name to be saved
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent conflicts
  },
});

const upload = multer({ storage: storage });

// Add Offer Route
router.post("/add-offer", upload.array("images", 5), async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    discount,
    validFrom,
    validTo,
    offerdescription,
  } = req.body;
  // const imageUrls = req.files.map((file) => file.filename);

  if (!name || !price || !stock || !category) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  const fileNames = req.files.map((file) => file.filename);

  try {
    const sql = `INSERT INTO products (name, description, price, stock, category, discount, validFrom, validTo, image,offer,offerdescription) 
                 VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [
      name,
      description,
      price,
      stock,
      category,
      discount,
      validFrom,
      validTo,
      JSON.stringify(fileNames),
      1,
      offerdescription,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error." });
      }
      res
        .status(201)
        .json({
          message: "Offer added successfully!",
          offerId: result.insertId,
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch Active Offers
router.get("/active-offers", (req, res) => {
  const query = "SELECT * FROM products WHERE offer = TRUE";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ offers: results });
  });
});

router.get("/offers", (req, res) => {
  var value=1;
  const query = "SELECT * FROM products WHERE offer =?";
  db.query(query,value,(err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ offers: results });
  });
});

router.put("/edit-offer/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    description,
    discount,
    validFrom,
    validTo,
    offerdescription,
  } = req.body;

  if (!name || !price || !description || !discount || !validFrom || !validTo || !offerdescription) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const query = `
      UPDATE products
      SET name = ?, price = ?, description = ?, discount = ?, validFrom = ?, validTo = ?, offerdescription = ?
      WHERE id = ?;
    `;

    db.query(
      query,
      [name, price, description, discount, validFrom, validTo, offerdescription, id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to update offer" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Offer not found" });
        }
        return res.status(200).json({ message: "Offer updated successfully!" });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/delete-offer/:id", (req, res) => {
  const offerId = req.params.id;

  // Query to delete the offer from the database
  const deleteQuery = "DELETE FROM products WHERE id = ?";

  db.execute(deleteQuery, [offerId], (err, result) => {
    if (err) {
      console.error("Error deleting offer:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete offer. Please try again." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    return res.status(200).json({ message: "Offer deleted successfully!" });
  });
});

router.get("/offer-stats", (req, res) => {
  const totalOffersQuery =
    "SELECT COUNT(*) AS totalOffers FROM products WHERE offer = TRUE";
  const activeOffersQuery =
    "SELECT COUNT(*) AS activeOffers FROM products WHERE offer = TRUE AND validTo >= CURDATE()";
  const expiredOffersQuery =
    "SELECT COUNT(*) AS expiredOffers FROM products WHERE offer = TRUE AND validTo < CURDATE()";
  const totalDiscountQuery =
    "SELECT SUM(discount) AS totalDiscount FROM products WHERE offer = TRUE AND validTo >= CURDATE()";
   
    

  db.query(totalOffersQuery, (err, totalOffersResult) => {
    if (err) return res.status(500).json({ error: "Database error" });

    db.query(activeOffersQuery, (err, activeOffersResult) => {
      if (err) return res.status(500).json({ error: "Database error" });

      db.query(expiredOffersQuery, (err, expiredOffersResult) => {
        if (err) return res.status(500).json({ error: "Database error" });

        db.query(totalDiscountQuery, (err, totalDiscountResult) => {
          if (err) return res.status(500).json({ error: "Database error" });

          res.status(200).json({
            totalOffers: totalOffersResult[0].totalOffers,
            activeOffers: activeOffersResult[0].activeOffers,
            expiredOffers: expiredOffersResult[0].expiredOffers,
            totalDiscount: totalDiscountResult[0].totalDiscount || 0, // Handle NULL case
          });
        });
      });
    });
  });
});

module.exports = router;
