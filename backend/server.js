const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

// Configure colors
colors.enable();

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.nodeEnvironment === 'production' 
    ? ['https://online-store-frontend.vercel.app', 'https://online-store-frontend-*.vercel.app'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Import Error Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Mount Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.serverPort || 5000;

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

module.exports = app;