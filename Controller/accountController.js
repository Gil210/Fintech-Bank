const Account = require('../Models/accountModel');

const createAccount = async (req, res) => {
  try {
    const { kycType, kycId, dob } = req.body;

    // 1. Validate mandatory request fields
    if (!kycType || !kycId || !dob) {
      return res.status(400).json({
        status: 'fail',
        message: 'kycType (BVN or NIN), kycId, and dob are required.'
      });
    }

    const normalizedType = kycType.toUpperCase();

    if (normalizedType !== 'BVN' && normalizedType !== 'NIN') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid kycType. Must be either "BVN" or "NIN".'
      });
    }

    // 2. Check if an account is already linked to this BVN or NIN
    const query = normalizedType === 'BVN' ? { bvn: kycId } : { nin: kycId };
    const existingAccount = await Account.findOne(query);

    if (existingAccount) {
      return res.status(400).json({
        status: 'fail',
        message: `An account is already linked to this ${normalizedType} (${kycId}).`
      });
    }

    // 3. Generate random 10-digit account number starting with 738
    const bankCode = '738';
    const random7Digits = Math.floor(1000000 + Math.random() * 9000000);
    const accountNumber = `${bankCode}${random7Digits}`;

    // 4. Create and save new account document in MongoDB Atlas
    const newAccountData = {
      accountNumber,
      bankName: "Gil's bank",
      dob,
      kycType: normalizedType,
      balance: 15000
    };

    if (normalizedType === 'BVN') {
      newAccountData.bvn = kycId;
      newAccountData.bvnVerified = true;
    } else {
      newAccountData.nin = kycId;
      newAccountData.ninVerified = true;
    }

    const savedAccount = await Account.create(newAccountData);

    // 5. Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Account created successfully',
      data: {
        accountNumber: savedAccount.accountNumber,
        bankName: savedAccount.bankName,
        kycType: savedAccount.kycType,
        kycId,
        dob: savedAccount.dob,
        balance: savedAccount.balance
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createAccount };