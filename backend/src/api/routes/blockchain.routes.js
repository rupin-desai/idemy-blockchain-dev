const express = require('express');
const blockchainController = require('../controllers/blockchain.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/info', blockchainController.getNetworkInfo);

// Protected routes
router.get(
  '/wallet/balance/:address',
  authMiddleware.authenticate,
  blockchainController.getWalletBalance
);

router.post(
  '/wallet/create',
  authMiddleware.authenticate,
  blockchainController.createWallet
);

router.post(
  '/send',
  authMiddleware.authenticate,
  blockchainController.sendTransaction
);

module.exports = router;