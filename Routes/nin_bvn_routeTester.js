const express = require('express');
const router = express.Router();
const { createBVN } = require('../Controller/bvnController');
const { createNIN } = require('../Controller/ninController');

// POST /api/v1/nin-bvn/insertBVN
router.post('/insertBVN', createBVN);

// POST /api/v1/nin-bvn/insertNIN
router.post('/insertNIN', createNIN);

module.exports = router;