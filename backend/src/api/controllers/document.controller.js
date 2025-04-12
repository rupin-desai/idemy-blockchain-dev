const ssiService = require('../../services/ssi.service');
const firebaseService = require('../../services/firebase.service');
const blockchainService = require('../../blockchain/services/blockchain.service');
const { catchAsync, AppError } = require('../../utils/error-handler.util');

/**
 * Create a new document
 */
exports.createDocument = catchAsync(async (req, res) => {
  const { did, documentType, name, description, expiryDate } = req.body;
  const { uid, role } = req.user;
  
  // Only issuers and admins can create documents
  if (role !== 'issuer' && role !== 'admin') {
    throw new AppError('Permission denied: only issuers and admins can create documents', 403);
  }
  
  // Check if identity exists
  const identity = await firebaseService.getIdentityByDid(did);
  
  if (!identity) {
    throw new AppError('Identity not found', 404);
  }
  
  // Get issuer wallet address
  const issuerProfile = await firebaseService.getUserProfile(uid);
  
  if (!issuerProfile.walletAddress) {
    throw new AppError('Issuer does not have a wallet address', 400);
  }
  
  // Create document data
  const documentData = {
    did,
    userId: identity.userId,
    documentType,
    name,
    description,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
    issuerId: uid,
    issuerName: issuerProfile.displayName,
    issuerAddress: issuerProfile.walletAddress
  };
  
  // Create document with file
  const document = await ssiService.createDocument(documentData, req.file.buffer);
  
  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: document
  });
});

/**
 * Get document by ID
 */
exports.getDocument = catchAsync(async (req, res) => {
  const { documentId } = req.params;
  
  const documentData = await ssiService.getDocument(documentId);
  
  res.status(200).json({
    success: true,
    data: documentData
  });
});

/**
 * List user documents
 */
exports.getUserDocuments = catchAsync(async (req, res) => {
  const { uid } = req.user;
  
  const documents = await firebaseService.getUserDocuments(uid);
  
  res.status(200).json({
    success: true,
    data: documents
  });
});

/**
 * List documents for an identity
 */
exports.getIdentityDocuments = catchAsync(async (req, res) => {
  const { did } = req.params;
  const { uid, role } = req.user;
  
  // Check permissions
  const identity = await firebaseService.getIdentityByDid(did);
  
  if (!identity) {
    throw new AppError('Identity not found', 404);
  }
  
  // Only owner, issuer, or admin can access documents
  if (identity.userId !== uid && role !== 'admin' && role !== 'issuer') {
    throw new AppError('Permission denied', 403);
  }
  
  const documents = await firebaseService.getIdentityDocuments(did);
  
  res.status(200).json({
    success: true,
    data: documents
  });
});

/**
 * Verify a document
 */
exports.verifyDocument = catchAsync(async (req, res) => {
  const { documentId } = req.params;
  
  const isValid = await blockchainService.isDocumentValid(documentId);
  
  if (!isValid) {
    return res.status(200).json({
      success: true,
      verified: false,
      message: 'Document is not verified or has been revoked'
    });
  }
  
  // Get document details
  const document = await firebaseService.getDocumentById(documentId);
  
  res.status(200).json({
    success: true,
    verified: true,
    message: 'Document is valid',
    data: {
      documentId,
      issuer: document.issuer,
      issuanceDate: document.issuanceDate,
      documentType: document.documentType
    }
  });
});

/**
 * Revoke a document
 */
exports.revokeDocument = catchAsync(async (req, res) => {
  const { documentId } = req.params;
  const { uid, role } = req.user;
  
  // Get document
  const document = await firebaseService.getDocumentById(documentId);
  
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  // Check if user is the issuer or admin
  if (document.issuer !== uid && role !== 'admin') {
    throw new AppError('Permission denied: only the issuer or admin can revoke this document', 403);
  }
  
  // Revoke document on blockchain
  await blockchainService.revokeDocument(documentId, document.issuerAddress);
  
  // Update document status in Firebase
  await firebaseService.updateDocument(documentId, {
    status: 'revoked',
    revokedAt: new Date(),
    revokedBy: uid
  });
  
  res.status(200).json({
    success: true,
    message: 'Document revoked successfully'
  });
});