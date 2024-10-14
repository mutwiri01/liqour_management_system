// server/models/Liquor.js
const mongoose = require('mongoose');

const liquorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true }, // Image URL field
});

module.exports = mongoose.model('Liquor', liquorSchema);
