const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

// Sample products data
const products = [
  {
    name: 'iPhone 14 Pro',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    brand: 'Apple',
    category: 'Electronics',
    description: 'Latest iPhone with advanced camera system and A16 Bionic chip',
    price: 999.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Samsung Galaxy S23',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    brand: 'Samsung',
    category: 'Electronics',
    description: 'Flagship Android phone with excellent camera and display',
    price: 799.99,
    countInStock: 7,
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: 'MacBook Air M2',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
    brand: 'Apple',
    category: 'Computers',
    description: 'Lightweight laptop with M2 chip and all-day battery life',
    price: 1199.99,
    countInStock: 5,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'Sony WH-1000XM4',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    brand: 'Sony',
    category: 'Audio',
    description: 'Industry-leading noise canceling wireless headphones',
    price: 349.99,
    countInStock: 15,
    rating: 4.6,
    numReviews: 20,
  },
  {
    name: 'iPad Pro 12.9"',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    brand: 'Apple',
    category: 'Tablets',
    description: 'Professional tablet with M2 chip and Liquid Retina display',
    price: 1099.99,
    countInStock: 8,
    rating: 4.4,
    numReviews: 10,
  },
  {
    name: 'Dell XPS 13',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    brand: 'Dell',
    category: 'Computers',
    description: 'Premium ultrabook with stunning InfinityEdge display',
    price: 999.99,
    countInStock: 6,
    rating: 4.2,
    numReviews: 7,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();

    // Create admin user for products
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Creating admin user...');
      const newAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });
      
      // Add user reference to products
      const productsWithUser = products.map(product => ({
        ...product,
        user: newAdmin._id,
      }));
      
      await Product.insertMany(productsWithUser);
    } else {
      // Add user reference to products
      const productsWithUser = products.map(product => ({
        ...product,
        user: adminUser._id,
      }));
      
      await Product.insertMany(productsWithUser);
    }

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}