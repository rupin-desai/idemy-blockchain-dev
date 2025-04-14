const ssiService = require('../../services/ssi.service');
const { catchAsync, AppError } = require('../../utils/error-handler.util');

/**
 * Create a new identity
 */
exports.createIdentity = catchAsync(async (req, res) => {
  const { personalInfo, address, contactInfo, walletAddress, studentInfo } = req.body;
  const { uid } = req.user;
  
  // For development - allow admin to create identities
  console.log("Creating new identity with user UID:", uid);
  
  // Create identity
  const identity = await ssiService.createIdentity(
    { personalInfo, address, contactInfo, walletAddress, studentInfo },
    uid
  );
  
  res.status(201).json({
    success: true,
    message: 'Identity created successfully',
    data: identity
  });
});

/**
 * Get identity by DID
 */
exports.getIdentity = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  const identity = await ssiService.getIdentity(did);
  
  res.status(200).json({
    success: true,
    data: identity
  });
});

/**
 * Update identity
 */
exports.updateIdentity = catchAsync(async (req, res) => {
  const { did } = req.params;
  const { address, contactInfo } = req.body;
  
  const updatedIdentity = await ssiService.updateIdentity(did, {
    address,
    contactInfo
  });
  
  res.status(200).json({
    success: true,
    message: 'Identity updated successfully',
    data: updatedIdentity
  });
});

/**
 * Verify identity (admin/issuer only)
 */
exports.verifyIdentity = catchAsync(async (req, res) => {
  const { did } = req.params;
  const { status } = req.body;
  const { uid, role } = req.user;
  
  // Check permissions
  if (role !== 'admin' && role !== 'issuer') {
    throw new AppError('Permission denied: only admins or issuers can verify identities', 403);
  }
  
  // Update identity status
  const updatedIdentity = await ssiService.verifyIdentity(did, status, uid);
  
  res.status(200).json({
    success: true,
    message: `Identity ${status} successfully`,
    data: updatedIdentity
  });
});

/**
 * Get user's own identity
 */
exports.getMyIdentity = catchAsync(async (req, res) => {
  const { uid } = req.user;
  
  // Get identity from Firebase
  const identity = await req.app.locals.firebase.getIdentityByUserId(uid);
  
  if (!identity) {
    throw new AppError('No identity found for this user', 404);
  }
  
  // Get full identity details
  const fullIdentity = await ssiService.getIdentity(identity.did);
  
  res.status(200).json({
    success: true,
    data: fullIdentity
  });
});

/**
 * List identities (admin only)
 */
exports.listIdentities = catchAsync(async (req, res) => {
  const { role } = req.user;
  const { status, page = 1, limit = 10 } = req.query;
  
  // Check permissions
  if (role !== 'admin') {
    throw new AppError('Permission denied: admin access required', 403);
  }
  
  // List identities
  const result = await req.app.locals.firebase.listIdentities(
    { status },
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result
  });
});