// db.js

// Import dotenv module to load environment variables from .env file
require("dotenv").config();

// Import mongoose module for MongoDB interaction
const mongoose = require("mongoose");

// Define connectDB function to establish connection with MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection URL from environment variables
        await mongoose.connect(process.env.MONGODB_URI);

        // Log a success message upon successful connection
        console.log("Connected to MongoDB database successfully!");
    } catch (error) {
        // Log an error message if connection fails
        console.log("Error connecting to MongoDB: ", error);
    }
}

// Export the connectDB function to make it accessible from other modules
module.exports = connectDB;