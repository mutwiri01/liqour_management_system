const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  liquor: { type: mongoose.Schema.Types.ObjectId, ref: 'Liquor', required: true },
  quantitySold: { type: Number, required: true },
  dateSold: { type: Date, default: Date.now },
});

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
