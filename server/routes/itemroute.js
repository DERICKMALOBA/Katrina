const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../frontend");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Handle Multiple Image Uploads and Store in MySQL
  router.post("/itemssubmit", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const fileNames = req.files.map((file) => file.filename);
      const {description,name,price,stock,category} = req.body;
      const fq=fileNames;

      var f=[description,name,price,stock,category,JSON.stringify(fq)]
    const query="INSERT INTO products (description,name,price,stock,category,image) VALUES(?,?,?,?,?,?)";
    db.query(query,f,async (err,results)=>{
        if (err) {
            console.log(f);
            return res.status(500).json({ message: 'Database error', error: err });
          }
            res.json({
                message: 'File uploaded successfully!'
            });
    });
});
module.exports = router;
