import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authroutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());  // Parse incoming JSON request bodies

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
