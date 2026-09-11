const express = require('express');
const router = express.Router();
const { 
  transferFunds, 
  getTransactionHistory 
} = require('../Controller/transactionController');

const { protect } = require('../Middleware/auth');

router.use(protect);

router.post('/transfer', transferFunds);
router.get('/history/:accountNumber', getTransactionHistory);

module.exports = router;