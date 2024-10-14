// server/routes/liquorRoutes.js
const express = require('express');
const multer = require('multer');
const { addLiquor, getLiquors, deleteLiquor } = require('../controllers/liquorController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set a unique filename
  },
});
const upload = multer({ storage });

// Define your routes
router.post('/', upload.single('image'), addLiquor); // POST route for adding liquor
router.get('/', getLiquors); // GET route for fetching all liquors
router.delete('/:id', deleteLiquor); // DELETE route for deleting liquor by ID

// Export the router
module.exports = router;
