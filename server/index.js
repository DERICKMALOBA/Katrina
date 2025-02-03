const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser'); // Ensure body-parser is required
const authRoutes = require('./routes/authroutes.js');
const usersRoutes = require('./routes/usersroute.js');
const productRoutes = require('./routes/ProductRoute.js');
const salesRoutes = require('./routes/salesroute.js');
const orderRoutes = require('./routes/orderroute.js');
const db = require('./config/db.js');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/orders', orderRoutes);
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
