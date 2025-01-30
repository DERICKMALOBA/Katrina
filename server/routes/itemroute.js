const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: '../frontend', // Directory where files will be stored
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer
const upload = multer({ storage: storage });


// File Upload Route (Handles both text fields and image)
router.post('/itemssubmit', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    var file=req.file.filename;
    console.log(file);
    const {description,name,price,stock,category} = req.body;
    const query="INSERT INTO products (description,name,price,stock,category,image1,image2,image3,image4,image5,image6,image7,image8,image9,image10) VALUES(?,?,?,?,?,?,'NO','NO','NO','NO','NO','NO','NO','NO','NO')";
    db.query(query,[description,name,price,stock,category,file],async (err,results)=>{
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
          }
          else{
            res.json({
                message: 'File uploaded successfully!',
                file: req.file.filename,
                description: description
            });
          }
    });
});
module.exports = router;
