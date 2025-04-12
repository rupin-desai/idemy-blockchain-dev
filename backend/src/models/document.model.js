// This file defines the document schema for reference
// With Firebase, we don't need traditional MongoDB models
// But we keep this for documentation and validation purposes

const documentSchema = {
  documentId: String,
  did: String,
  userId: String,
  documentType: String, // 'identification', 'certificate', 'diploma', 'license', 'medical', 'other'
  issuer: String,
  issuerAddress: String,
  name: String,
  description: String,
  ipfsHash: String,
  ipfsMetadataHash: String,
  issuanceDate: Date,
  expiryDate: Date,
  status: String, // 'active', 'expired', 'revoked'
  blockchainTxHash: String,
  createdAt: Date,
  updatedAt: Date,
};

module.exports = documentSchema;
