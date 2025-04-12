const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protected routes
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.requireIssuer,
  upload.single('file'),
  validationMiddleware.validateDocument,
  documentController.createDocument
);

router.get(
  '/:documentId',
  authMiddleware.authenticate,
  documentController.getDocument
);

router.get(
  '/verify/:documentId',
  documentController.verifyDocument
);

router.delete(
  '/:documentId/revoke',
  authMiddleware.authenticate,
  documentController.revokeDocument
);

router.get(
  '/user/documents',
  authMiddleware.authenticate,
  documentController.getUserDocuments
);

router.get(
  '/identity/:did/documents',
  authMiddleware.authenticate,
  documentController.getIdentityDocuments
);

module.exports = router;