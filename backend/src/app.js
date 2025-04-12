const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./api/routes');
const config = require('./config');
const firebaseService = require('./services/firebase.service');
const ipfsService = require('./services/ipfs.service');
const blockchainService = require('./blockchain/services/blockchain.service');
const { logger, globalErrorHandler } = require('./utils');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors(config.app.corsOptions)); // CORS configuration
app.use(compression()); // Response compression
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Make services available in request
app.locals.firebase = firebaseService;
app.locals.ipfs = ipfsService;
app.locals.blockchain = blockchainService;

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Blockchain SSI API',
    version: '1.0',
    endpoints: '/api',
  });
});

// Global error handler
app.use(globalErrorHandler);

// 404 middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Start server
const PORT = config.app.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.app.env}`);
  
  // Log service initialization
  logger.info('Initializing services...');
  
  // Test IPFS connection
  ipfsService.testConnection()
    .then(connected => {
      logger.info(`IPFS Connection: ${connected ? 'OK' : 'Failed'}`);
    })
    .catch(err => {
      logger.error('IPFS Connection Error:', err.message);
    });
    
  // Log blockchain network
  blockchainService.getNetworkInfo()
    .then(info => {
      logger.info(`Blockchain Network: ${info.networkId}`);
      logger.info(`Current Block: ${info.blockNumber}`);
    })
    .catch(err => {
      logger.error('Blockchain Connection Error:', err.message);
    });
});

module.exports = app;