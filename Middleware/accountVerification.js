const Account = require('../Models/accountModel');

const verifyAccountExists = async (req, res, next) => {
  try {
    const accountNumber = req.params.accountNumber || req.body.accountNumber;
    
    if (!accountNumber) {
      return res.status(400).json({ status: 'fail', message: 'Account number is required' });
    }

    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ status: 'fail', message: 'Target account does not exist' });
    }

    req.account = account; // Attach verified account to request object
    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { verifyAccountExists };