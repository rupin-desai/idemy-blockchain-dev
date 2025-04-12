const { AppError } = require('../../utils/error-handler.util');
const authValidator = require('../validators/auth.validator');
const documentValidator = require('../validators/document.validator');
const identityValidator = require('../validators/identity.validator');
const didUtil = require('../../utils/did.util');

/**
 * Validate user registration data
 */
exports.validateRegistration = (req, res, next) => {
  const { error } = authValidator.registerSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};

/**
 * Validate login data
 */
exports.validateLogin = (req, res, next) => {
  const { error } = authValidator.loginSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};

/**
 * Validate identity data
 */
exports.validateIdentity = (req, res, next) => {
  const { error } = identityValidator.createIdentitySchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};

/**
 * Validate document creation data
 */
exports.validateDocument = (req, res, next) => {
  // Check file upload
  if (!req.file) {
    throw new AppError('Document file is required', 400);
  }
  
  const { error } = documentValidator.createDocumentSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  
  // Validate DID format
  const didValidation = didUtil.validateDid(req.body.did);
  if (!didValidation) {
    throw new AppError('Invalid DID format', 400);
  }
  
  next();
};

/**
 * Validate identity verification
 */
exports.validateIdentityVerification = (req, res, next) => {
  const { error } = identityValidator.verifyIdentitySchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};

/**
 * Validate profile update
 */
exports.validateProfileUpdate = (req, res, next) => {
  const { error } = authValidator.updateProfileSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};