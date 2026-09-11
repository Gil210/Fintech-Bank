const axios = require('axios');

const createBVN = async (req, res) => {
  try {
    const { bvn, firstName, lastName, dob, phone } = req.body;

    if (!bvn || !firstName || !lastName || !dob || !phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'bvn, firstName, lastName, dob, and phone are required fields.'
      });
    }

    //Validate exact 11-digit numeric BVN format
    const bvnRegex = /^\d{11}$/;

  if (!bvnRegex.test(String(bvn))) {
  return res.status(400).json({
    status: 'fail',
    message: 'Invalid BVN format. BVN must be exactly 11 digits.'
  });
}

    // Call NIBSS Sandbox API
    const nibssResponse = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/insertBvn`,
      { BVN: bvn, firstName, lastName, dob, phone },
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
      message: `BVN record created successfully with BVN: ${bvn}`,
      bvnNumber: bvn,
      nibssResponse: nibssResponse.data
    });

  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response ? error.response.data : error.message
    });
  }
};

module.exports = { createBVN };