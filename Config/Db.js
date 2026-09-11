const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's public DNS servers directly for resolves
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Atlas connected successfully.');
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;