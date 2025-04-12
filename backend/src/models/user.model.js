// This file defines the user schema for reference
// With Firebase, we don't need traditional MongoDB models
// But we keep this for documentation and validation purposes

const userSchema = {
  uid: String, // Firebase User UID
  email: String,
  displayName: String,
  phoneNumber: String,
  role: String, // 'user', 'admin', 'issuer'
  walletAddress: String,
  identityDid: String,
  isActive: Boolean,
  profileCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
};

module.exports = userSchema;
