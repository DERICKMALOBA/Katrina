const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authroutes.js');
const productRoutes = require('./routes/productsroute.js');
const itemRoutes = require('./routes/itemroute.js');
const db = require('./config/db.js');

// Load environment variables
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, './images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/items', itemRoutes);
// Test DB connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));