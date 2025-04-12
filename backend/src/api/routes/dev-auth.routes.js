const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config');

// Development only routes
if (process.env.NODE_ENV === 'development') {
  // Direct login with hard-coded admin credentials
  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check for admin credentials
    if (email === 'admin@university.edu' && password === 'Admin@123') {
      // Generate token with admin privileges
      const token = jwt.sign(
        {
          uid: 'dev-admin-uid',
          email: email,
          role: 'admin'
        },
        config.app.jwt.secret,
        { expiresIn: config.app.jwt.expiry }
      );

      // Return success with token
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            uid: 'dev-admin-uid',
            email: email,
            displayName: 'System Administrator',
            role: 'admin'
          }
        }
      });
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  });
}

module.exports = router;