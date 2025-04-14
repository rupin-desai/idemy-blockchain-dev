const firebaseService = require('../../services/firebase.service');
const authService = require('../../services/auth.service');
const { catchAsync, AppError } = require('../../utils/error-handler.util');

/**
 * Middleware to authenticate requests using JWT
 */
exports.authenticate = catchAsync(async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }
  
  const token = authHeader.split(' ')[1];
  
  // Verify token
  const decoded = authService.verifyToken(token);
  
  if (!decoded) {
    throw new AppError('Invalid or expired token', 401);
  }
  
  // Check if this is a development-generated token
  const isDevelopmentToken = process.env.NODE_ENV === 'development' && 
                           decoded.uid === 'dev-admin-uid';
  
  let userProfile;
  
  if (isDevelopmentToken) {
    // For development token, create a mock user profile
    userProfile = {
      uid: 'dev-admin-uid',
      email: 'admin@university.edu',
      displayName: 'System Administrator',
      role: 'admin',
      isActive: true
    };
  } else {
    // Get user profile from Firestore for normal users
    userProfile = await firebaseService.getUserProfile(decoded.uid);
    
    if (!userProfile) {
      throw new AppError('User not found', 401);
    }
    
    if (!userProfile.isActive) {
      throw new AppError('Account is deactivated', 403);
    }
  }
  
  // Set user in request
  req.user = {
    uid: decoded.uid,
    email: decoded.email,
    role: userProfile.role
  };
  
  next();
});

/**
 * Middleware to check admin role
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
  
  next();
};

/**
 * Middleware to check issuer role
 */
exports.requireIssuer = (req, res, next) => {
  if (!req.user || (req.user.role !== 'issuer' && req.user.role !== 'admin')) {
    throw new AppError('Issuer access required', 403);
  }
  
  next();
};