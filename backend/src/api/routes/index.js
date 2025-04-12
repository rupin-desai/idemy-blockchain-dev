const express = require('express');
const authRoutes = require('./auth.routes');
const identityRoutes = require('./identity.routes');
const documentRoutes = require('./document.routes');
const nftRoutes = require('./nft.routes');
const blockchainRoutes = require('./blockchain.routes');

const router = express.Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/identities', identityRoutes);
router.use('/documents', documentRoutes);
router.use('/nft', nftRoutes);
router.use('/blockchain', blockchainRoutes);

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;