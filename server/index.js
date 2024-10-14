const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const liquorRoutes = require("./routes/liquorRoutes"); // Import liquor routes
const Liquor = require("./models/Liquor"); // Import Liquor model
const Sale = require("./models/Sale");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Use the liquor routes
app.use("/api/liquors", liquorRoutes);

// PATCH route to update liquor quantity
app.patch("/api/liquors/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // Get the quantity from the request body

  Liquor.findById(id) // Use the Liquor model
    .then((liquorToUpdate) => {
      if (!liquorToUpdate) {
        return res.status(404).json({ message: "Liquor not found" });
      }

      if (quantity < 0) {
        return res.status(400).json({ message: "Quantity cannot be negative." }); // Handle negative quantity
      }

      // Update the quantity
      liquorToUpdate.quantity = quantity; // Set to the new quantity
      return liquorToUpdate.save(); // Save the updated liquor
    })
    .then((updatedLiquor) => {
      res.status(200).json(updatedLiquor); // Return the updated liquor
    })
    .catch((error) => {
      console.error("Error updating liquor quantity:", error); // Log the error
      res.status(500).json({
        message: "Error updating liquor quantity",
        error: error.message,
      });
    });
});

// GET route to fetch sales with pagination
app.get("/api/sales", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query
  const limit = parseInt(req.query.limit) || 10; // Get the limit of items per page

  const start = Date.now(); // Start time for logging

  Sale.find()
    .populate("liquor") // Populate liquor details
    .skip((page - 1) * limit) // Skip documents for pagination
    .limit(limit) // Limit documents for pagination
    .then((sales) => {
      const totalSales = Sale.countDocuments(); // Get total sales for pagination
      console.log(`Query time: ${Date.now() - start}ms`); // Log the duration
      return totalSales;
    })
    .then((totalSales) => {
      res.status(200).json({
        totalSales,
        totalPages: Math.ceil(totalSales / limit),
        currentPage: page,
        sales,
      });
    })
    .catch((error) => {
      console.error("Error fetching sales:", error);
      res.status(500).json({ message: "Failed to fetch sales", error: error.message });
    });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Resource API 83' });
});

// POST route to record a sale
app.post("/api/sales", (req, res) => {
  const { liquorId, quantitySold } = req.body;

  Liquor.findById(liquorId) // Find the liquor to sell
    .then((liquor) => {
      if (!liquor || liquor.quantity < quantitySold) {
        return res.status(400).json({ message: "Insufficient stock or liquor not found" });
      }

      // Update liquor quantity
      liquor.quantity -= quantitySold;
      return liquor.save();
    })
    .then((updatedLiquor) => {
      // Record the sale
      const newSale = new Sale({
        liquor: liquorId,
        quantitySold,
        dateSold: new Date(),
      });
      return newSale.save();
    })
    .then((newSale) => {
      res.status(201).json(newSale);
    })
    .catch((error) => {
      console.error("Error processing sale:", error);
      res.status(500).json({ message: "Error processing sale", error: error.message });
    });
});

// Connect to MongoDB and listen on the port for local development only
if (process.env.NODE_ENV !== "production") {
  connectDB()
    .then(() => {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
      // Set timeout for the server
      server.setTimeout(120000); // Set timeout to 120 seconds
    })
    .catch((error) => {
      console.log("Failed to connect to MongoDB. Server not started.");
    });
} else {
  // Export the app for Vercel
  module.exports = app;
}
