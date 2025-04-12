const authService = require('../../services/auth.service');
const validator = require('../../utils/validator.util');
const { catchAsync } = require('../../utils/error-handler.util');

/**
 * Register a new user
 */
exports.register = catchAsync(async (req, res) => {
  const { email, password, displayName, phoneNumber } = req.body;
  
  // Validate inputs
  const emailValidation = validator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ success: false, message: emailValidation.error });
  }
  
  const passwordValidation = validator.validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ success: false, message: passwordValidation.error });
  }
  
  // Register user
  const result = await authService.register({
    email,
    password,
    displayName,
    phoneNumber
  });
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

/**
 * Login user
 */
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate inputs
  const emailValidation = validator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ success: false, message: emailValidation.error });
  }
  
  // Login (password is validated by Firebase)
  const result = await authService.login(email, password);
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

/**
 * Get user profile
 */
exports.getProfile = catchAsync(async (req, res) => {
  const { uid } = req.user;
  
  const profile = await authService.getProfile(uid);
  
  res.status(200).json({
    success: true,
    data: profile
  });
});

/**
 * Update user profile
 */
exports.updateProfile = catchAsync(async (req, res) => {
  const { uid } = req.user;
  const { displayName, phoneNumber } = req.body;
  
  const updatedProfile = await authService.updateProfile(uid, {
    displayName,
    phoneNumber
  });
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedProfile
  });
});

/**
 * Reset password
 */
exports.resetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  
  // Validate email
  const emailValidation = validator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ success: false, message: emailValidation.error });
  }
  
  await authService.resetPassword(email);
  
  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
});