// server/controllers/liquorController.js
const Liquor = require('../models/Liquor');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Controller to add liquor
const addLiquor = async (req, res) => {
  const { name, brand, quantity } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path);
    
    const newLiquor = new Liquor({
      name,
      brand,
      quantity,
      imageUrl: result.secure_url, // Store the URL of the uploaded image
    });

    await newLiquor.save();
    res.status(201).json(newLiquor); // Return the newly created liquor object
  } catch (error) {
    console.error('Failed to add liquor:', error);
    res.status(500).json({ message: 'Failed to add liquor', error: error.message });
  }
};

// Controller to get all liquors
const getLiquors = async (req, res) => {
  try {
    const liquors = await Liquor.find();
    res.status(200).json(liquors); // Return the list of liquors
  } catch (error) {
    console.error('Failed to fetch liquors:', error);
    res.status(500).json({ message: 'Failed to fetch liquors', error: error.message });
  }
};

// Controller to delete liquor
const deleteLiquor = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedLiquor = await Liquor.findByIdAndDelete(id);
    
    if (!deletedLiquor) {
      return res.status(404).json({ message: 'Liquor not found' }); // Return 404 if liquor is not found
    }

    // Optionally, you can delete the image from Cloudinary if needed
    // const publicId = deletedLiquor.imageUrl.split('/').pop().split('.')[0];
    // await cloudinary.uploader.destroy(publicId);

    res.status(204).json({ message: 'Liquor deleted successfully' }); // No content response
  } catch (error) {
    console.error('Failed to delete liquor:', error);
    res.status(500).json({ message: 'Failed to delete liquor', error: error.message });
  }
};

const sellLiquor = async (req, res) => {
  const { id } = req.params;  // liquor ID
  const { quantitySold } = req.body;  // quantity to sell

  try {
    // Find the liquor by ID
    const liquor = await Liquor.findById(id);

    if (!liquor) {
      return res.status(404).json({ message: 'Liquor not found' });
    }

    if (liquor.quantity < quantitySold) {
      return res.status(400).json({ message: 'Insufficient stock to complete sale' });
    }

    // Reduce liquor quantity
    liquor.quantity -= quantitySold;
    await liquor.save();  // Save the updated liquor

    // Record the sale in the Sales collection
    const sale = new Sale({
      liquor: id,  // Reference the liquor
      quantitySold,
      dateSold: new Date(),
    });
    await sale.save();

    // Respond with the updated liquor and sale record
    res.status(200).json({ message: 'Sale successful', liquor, sale });
  } catch (error) {
    console.error('Error selling liquor:', error);
    res.status(500).json({ message: 'Failed to process sale', error: error.message });
  }
};

module.exports = { addLiquor, getLiquors, deleteLiquor, sellLiquor };
