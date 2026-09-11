const jwt = require('jsonwebtoken');
const Account = require('../Models/accountModel');
const Transaction = require('../Models/transactionModel');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @desc Perform Name Enquiry
 */
const nameEnquiry = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    if (!accountNumber) {
      return res.status(400).json({ success: false, message: 'accountNumber is required.' });
    }

    // MongoDB Query replaces array .find()
    const account = await Account.findOne({
      $or: [{ accountNumber: String(accountNumber) }, { kycID: String(accountNumber) }]
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: `Account or Customer with ID/Number ${accountNumber} not found.`
      });
    }

    const accountData = {
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      bankName: account.bankName
    };

    const accessToken = jwt.sign(
      {
        accountNumber: accountData.accountNumber,
        accountName: accountData.accountName,
        bankName: accountData.bankName
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Name enquiry successful',
      data: accountData,
      accessToken
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Initiate Fund Transfer
 */
const transferFunds = async (req, res) => {
  try {
    const { from, to, amount, destinationBank } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid transfer amount.' });
    }

    // Sender Lookup in MongoDB
    const senderAccount = await Account.findOne({ accountNumber: String(from) });
    if (!senderAccount) {
      return res.status(404).json({ success: false, message: `Sender account ${from} not found.` });
    }

    if (senderAccount.balance < transferAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Current balance is ₦${senderAccount.balance.toLocaleString()}`
      });
    }

    const isIntraBank = !destinationBank || destinationBank.toLowerCase() === 'phc bank';

    if (isIntraBank) {
      const receiverAccount = await Account.findOne({ accountNumber: String(to) });
      if (!receiverAccount) {
        return res.status(404).json({
          success: false,
          message: `Destination account ${to} not found in Phc Bank.`
        });
      }

      // Update Balances
      senderAccount.balance -= transferAmount;
      receiverAccount.balance += transferAmount;
      await senderAccount.save();
      await receiverAccount.save();
    } else {
      senderAccount.balance -= transferAmount;
      await senderAccount.save();
    }

    const generatedTxId = `TX${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
    const createdAtLocal = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });

    // Insert Document into MongoDB Atlas
    await Transaction.create({
      transactionId: generatedTxId,
      from,
      to,
      amount: transferAmount,
      type: isIntraBank ? 'INTRA_BANK' : 'INTER_BANK',
      destinationBank: destinationBank || 'Phc bank',
      status: 'SUCCESS',
      createdAtWAT: createdAtLocal
    });

    return res.status(200).json({
      message: "Transfer successful",
      transactionId: generatedTxId,
      amount: transferAmount,
      from,
      to,
      status: "SUCCESS"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Transaction History
 */
const getTransactionHistory = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Data Privacy & Isolation Check
    if (String(req.user.accountNumber) !== String(accountNumber)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own transaction history.'
      });
    }

    // Query transactions where accountNumber is either sender OR recipient
    const userTransactions = await Transaction.find({
      $or: [{ from: String(accountNumber) }, { to: String(accountNumber) }]
    }).sort({ createdAt: -1 });

    const formattedHistory = userTransactions.map(t => {
      const isDebit = String(t.from) === String(accountNumber);
      return {
        transactionId: t.transactionId,
        type: isDebit ? 'DEBIT' : 'CREDIT',
        category: t.type,
        amount: t.amount,
        sender: t.from,
        recipient: t.to,
        destinationBank: t.destinationBank,
        status: t.status,
        timestamp: t.createdAtWAT
      };
    });

    return res.status(200).json({
      success: true,
      accountNumber: String(accountNumber),
      totalTransactions: formattedHistory.length,
      data: formattedHistory
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  nameEnquiry,
  transferFunds,
  getTransactionHistory
};