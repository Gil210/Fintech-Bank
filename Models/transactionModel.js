const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INTRA_BANK', 'INTER_BANK'], required: true },
  destinationBank: { type: String, default: 'Phc bank' },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
  createdAtWAT: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);