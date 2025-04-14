const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/info', blockchainController.getBlockchainInfo);
router.get('/contracts', blockchainController.getContractAddresses);
router.get('/contracts/identity/count', blockchainController.getStudentCount);

// Protected routes
router.get(
  '/contracts/identity/verify',
  authMiddleware.authenticate,
  blockchainController.verifyStudentRecords
);

router.get(
  '/contracts/card/validate',
  authMiddleware.authenticate,
  blockchainController.checkCardValidity
);

router.post(
  '/wallet/create',
  authMiddleware.authenticate,
  blockchainController.createWallet
);

router.get(
  '/wallet/balance/:address',
  authMiddleware.authenticate,
  blockchainController.getWalletBalance
);

module.exports = router;