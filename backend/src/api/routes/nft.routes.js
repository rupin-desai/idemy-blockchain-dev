const express = require('express');
const nftController = require('../controllers/nft.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Protected routes
router.post(
  '/mint/:did',
  authMiddleware.authenticate,
  nftController.mintIDCard
);

router.post(
  '/:tokenId/link/:documentId',
  authMiddleware.authenticate,
  nftController.linkDocument
);

router.get(
  '/identity/:did',
  authMiddleware.authenticate,
  nftController.getIDCard
);

router.get(
  '/token/:did',
  authMiddleware.authenticate,
  nftController.getTokenByDID
);

module.exports = router;