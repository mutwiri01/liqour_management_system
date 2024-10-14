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
app.patch("/api/liquors/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // Get the quantity from the request body

  try {
    const liquorToUpdate = await Liquor.findById(id); // Use the Liquor model

    if (!liquorToUpdate) {
      return res.status(404).json({ message: "Liquor not found" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative." }); // Handle negative quantity
    }

    // Update the quantity
    liquorToUpdate.quantity = quantity; // Set to the new quantity
    await liquorToUpdate.save(); // Save the updated liquor

    res.status(200).json(liquorToUpdate); // Return the updated liquor
  } catch (error) {
    console.error("Error updating liquor quantity:", error); // Log the error
    res.status(500).json({
      message: "Error updating liquor quantity",
      error: error.message,
    });
  }
});

// GET route to fetch sales
app.get("/api/sales", async (req, res) => {
  try {
    const sales = Sale.find().populate("liquor").limit(10).lean();// Populate liquor details
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch sales", error: error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Resource API 83' });
});


// POST route to record a sale
app.post("/api/sales", async (req, res) => {
  const { liquorId, quantitySold } = req.body;

  try {
    // Find the liquor to sell
    const liquor = await Liquor.findById(liquorId);

    if (!liquor || liquor.quantity < quantitySold) {
      return res
        .status(400)
        .json({ message: "Insufficient stock or liquor not found" });
    }

    // Update liquor quantity
    liquor.quantity -= quantitySold;
    await liquor.save();

    // Record the sale
    const newSale = new Sale({
      liquor: liquorId,
      quantitySold,
      dateSold: new Date(),
    });
    await newSale.save();

    res.status(201).json(newSale);
  } catch (error) {
    console.error("Error processing sale:", error);
    res
      .status(500)
      .json({ message: "Error processing sale", error: error.message });
  }
});

// Connect to MongoDB and listen on the port for local development only
if (process.env.NODE_ENV !== "production") {
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((error) => {
      console.log("Failed to connect to MongoDB. Server not started.");
    });
} else {
  // Export the app for Vercel
  module.exports = app;
}
