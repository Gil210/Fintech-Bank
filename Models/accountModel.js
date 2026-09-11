const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  kycID: { type: String, required: true },
  kycType: { type: String, enum: ['BVN', 'NIN', 'VOTER_ID'], required: true },
  balance: { type: Number, default: 0 },
  bankName: { type: String, default: 'Phc bank' }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);