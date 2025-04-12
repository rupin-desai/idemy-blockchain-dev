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

module.exports = router;