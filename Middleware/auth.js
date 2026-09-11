const jwt = require('jsonwebtoken');
const Account = require('../Models/accountModel');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please supply a valid bearer token.'
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Fetch user from Atlas to ensure the account was not deleted or deactivated
    const currentAccount = await Account.findById(decoded.id);
    if (!currentAccount) {
      return res.status(401).json({
        status: 'fail',
        message: 'The account belonging to this token no longer exists.'
      });
    }

    // Attach decoded user/account payload to req
    req.user = currentAccount;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = { protect };