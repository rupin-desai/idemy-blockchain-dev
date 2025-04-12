const express = require('express');
const identityController = require('../controllers/identity.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');

const router = express.Router();

// Protected routes
router.post(
  '/',
  authMiddleware.authenticate,
  validationMiddleware.validateIdentity,
  identityController.createIdentity
);

router.get(
  '/my-identity',
  authMiddleware.authenticate,
  identityController.getMyIdentity
);

router.get(
  '/:did',
  authMiddleware.authenticate,
  identityController.getIdentity
);

router.put(
  '/:did',
  authMiddleware.authenticate,
  identityController.updateIdentity
);

router.put(
  '/:did/verify',
  authMiddleware.authenticate,
  authMiddleware.requireIssuer,
  identityController.verifyIdentity
);

router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.requireAdmin,
  identityController.listIdentities
);

module.exports = router;