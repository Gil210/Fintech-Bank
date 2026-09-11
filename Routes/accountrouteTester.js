const express = require('express');
const router = express.Router();
const { createAccount } = require('../Controller/accountController');

// POST /api/v1/accounts/create-account
router.post('/create-account', createAccount);

module.exports = router;