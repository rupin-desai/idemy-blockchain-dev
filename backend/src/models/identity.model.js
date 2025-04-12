// This file defines the identity schema for reference
// With Firebase, we don't need traditional MongoDB models
// But we keep this for documentation and validation purposes

const identitySchema = {
  did: String,
  userId: String,
  walletAddress: String,
  personalInfo: {
    firstName: String,
    lastName: String,
    middleName: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    placeOfBirth: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  contactInfo: {
    email: String,
    phone: String,
  },
  idCardTokenId: Number,
  identityStatus: String, // 'pending', 'verified', 'rejected', 'revoked'
  verificationDate: Date,
  verifiedBy: String,
  ipfsMetadataHash: String,
  blockchainTxHash: String,
  createdAt: Date,
  updatedAt: Date,
};

module.exports = identitySchema;
