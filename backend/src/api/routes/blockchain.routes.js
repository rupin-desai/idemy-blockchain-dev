const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/info', blockchainController.getBlockchainInfo);
router.get('/contracts', blockchainController.getContractAddresses);
router.get('/contracts/identity/count', blockchainController.getStudentCount);

// Get all student identities
router.get('/students', blockchainController.getStudentIdentities);

// Check blockchain status for a student
router.get('/students/status/:did', blockchainController.getStudentBlockchainStatus);

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

// Verify a student identity
router.post('/students/verify/:did', authMiddleware.authenticate, blockchainController.verifyStudentIdentity);

// Revoke a student identity
router.post('/students/revoke/:did', authMiddleware.authenticate, blockchainController.revokeStudentIdentity);

module.exports = router;