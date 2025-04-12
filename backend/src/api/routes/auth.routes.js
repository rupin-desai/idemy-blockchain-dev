const express = require('express');
const authController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', validationMiddleware.validateRegistration, authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware.authenticate, authController.getProfile);
router.put('/profile', authMiddleware.authenticate, authController.updateProfile);

// Development only - Create admin account for testing
// Remove this conditional and route if createDevAdmin doesn't exist
/* 
if (process.env.NODE_ENV === 'development') {
  router.post('/create-dev-admin', authController.createDevAdmin);
}
*/

module.exports = router;