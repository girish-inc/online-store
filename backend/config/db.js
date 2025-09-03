const mongoose = require('mongoose');
require('colors');

/**
 * Establishes connection to MongoDB database
 * @returns {Promise<mongoose.Connection>}
 */
const connectDB = async () => {
  try {
    // Connection options for MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
    };

    const conn = await mongoose.connect(process.env.databaseUrl, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    
    // Log detailed error information
    if (error.code) {
      console.error(`Error Code: ${error.code}`.yellow);
    }
    
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Please check your MONGO_URI in .env file'.red);
    } else if (error.name === 'MongoNetworkError') {
      console.error('Network error connecting to MongoDB. Please check your internet connection and MongoDB service'.red);
    }
    
    // Only exit in production environment, otherwise just log the error
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting process due to MongoDB connection failure'.red.bold);
      process.exit(1);
    } else {
      console.warn('Failed to connect to MongoDB. Application will continue but database features will not work'.yellow.bold);
    }
  }
};

module.exports = connectDB;