const axios = require('axios');

const createNIN = async (req, res) => {
  try {
    const { nin, firstName, lastName, dob } = req.body;

    if (!nin || !firstName || !lastName || !dob) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required.'
      });
    }

    // Call NIBSS Sandbox API
    const nibssResponse = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/insertNin`,
      { NIN: nin, firstName, lastName, dob },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NIBSS_API_KEY,
          'x-api-secret': process.env.NIBSS_API_SECRET
        }
      }
    );

    return res.status(200).json({
      status: 'success',
      message: `NIN created successfully with NIN: ${nin}`,
      ninNumber: nin,
      nibssResponse: nibssResponse.data
    });

  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response ? error.response.data : error.message
    });
  }
};

module.exports = { createNIN };