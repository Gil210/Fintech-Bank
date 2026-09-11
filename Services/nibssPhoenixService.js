const axios = require('axios');
// Calling BVN into external API
exports.verifyBvnWithPhoenix = async (data) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://nibssbyphoenix.onrender.com/api/insertBvn',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(data)
  };

  const response = await axios.request(config);
  return response.data;
};
// Calling NIN into External API
exports.verifyNinWithPhoenix = async (data) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://nibssbyphoenix.onrender.com/api/insertNin',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(data)
  };

  const response = await axios.request(config);
  return response.data;
};

// Generating an account number
exports.generateAccountNumber = async (data) => {
  // Generates a mock 10-digit NUBAN account number starting with '02'
  const mockAccountNumber = `21${Math.floor(10000000 + Math.random() * 90000000)}`;

  return {
    status: 'SUCCESS',
    accountNumber: mockAccountNumber,
    message: 'Account number generated successfully'
  };
};