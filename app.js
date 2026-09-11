const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config(); // 1. Load environment variables
const express = require('express');
const connectDB = require('./Config/Db'); // 2. Import database connection

const app = express();

// 3. Built-in Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Connect to MongoDB Atlas
connectDB();

// 5. Import Route Modules
const nin_bvn_routeTester = require('./Routes/nin_bvn_routeTester');
const accountrouteTester = require('./Routes/accountrouteTester');
const transactionrouteTester = require('./Routes/transactionrouteTester');

// 6. Mount API Routes
app.use('/api/v1/nin-bvn', nin_bvn_routeTester);
app.use('/api/v1/accounts', accountrouteTester);
app.use('/api/v1/transactions', transactionrouteTester);

// 7. Health Check / Root Endpoint
app.get('/', (req, res) => {
  res.status(200).send('This application is working');
});

// 8. 404 Fallback for Unmatched Endpoints (returns clean JSON in Postman)
app.all('{*path}', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find endpoint ${req.originalUrl} on this server!`
  });
});

// 9. Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// 10. Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} is up and running`);
});