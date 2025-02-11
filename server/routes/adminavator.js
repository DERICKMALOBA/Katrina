// routes/admin.js

const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const AdmiRrouter = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Route to handle avatar upload
AdmiRrouter.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (req.file) {
    // If a file is uploaded, return the file URL
    const avatarUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, imageUrl: avatarUrl });
  } else {
    // If no file is uploaded, return an error
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }
});

// Route to get the current avatar
AdmiRrouter.get("/get-avatar", (req, res) => {
  // Check for the default avatar or use the existing avatar
  const defaultAvatar = "/uploads/default-avatar.png"; // Default avatar URL
  const avatarPath = path.join(uploadDir, "default-avatar.png");

  // If there are no custom avatars, we will return the default avatar
  if (fs.existsSync(avatarPath)) {
    return res.json({ avatarUrl: defaultAvatar });
  }
  
  // Respond with the default avatar path
  return res.json({ avatarUrl: defaultAvatar });
});

module.exports = AdmiRrouter;
