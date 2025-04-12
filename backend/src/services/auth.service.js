const jwt = require('jsonwebtoken');
const config = require('../config');
const firebaseService = require('./firebase.service');

class AuthService {
  /**
   * Generate JWT token
   * @param {Object} user - User object
   */
  generateToken(user) {
    return jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        role: user.role
      },
      config.app.jwt.secret,
      { expiresIn: config.app.jwt.expiry }
    );
  }
  
  /**
   * Verify JWT token
   * @param {String} token - JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.app.jwt.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  async register(userData) {
    try {
      // Check if user already exists
      try {
        const existingUser = await firebaseService.auth.getUserByEmail(userData.email);
        if (existingUser) {
          throw new Error('User already exists with this email');
        }
      } catch (error) {
        // If error code is auth/user-not-found, it's fine to continue
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }
      
      // Create user in Firebase
      const userRecord = await firebaseService.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        role: 'user'
      });
      
      // Generate JWT token
      const token = this.generateToken({
        uid: userRecord.uid,
        email: userRecord.email,
        role: 'user'
      });
      
      return {
        token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName || userRecord.email.split('@')[0],
          role: 'user'
        }
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }
  
  /**
   * Login user with email and password
   * @param {String} email - User email
   * @param {String} password - User password
   */
  async login(email, password) {
    try {
      // This is handled on the client-side with Firebase Auth
      // Here we just fetch the user data and generate a token
      const userRecord = await firebaseService.auth.getUserByEmail(email);
      
      // Get user profile from Firestore
      const userProfile = await firebaseService.getUserProfile(userRecord.uid);
      
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      
      if (!userProfile.isActive) {
        throw new Error('Account is deactivated');
      }
      
      // Update last login timestamp
      await firebaseService.db.collection('users').doc(userRecord.uid).update({
        lastLogin: firebaseService.admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Generate JWT token
      const token = this.generateToken({
        uid: userRecord.uid,
        email: userRecord.email,
        role: userProfile.role
      });
      
      return {
        token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userProfile.displayName,
          role: userProfile.role
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
  
  /**
   * Get user profile
   * @param {String} uid - User UID
   */
  async getProfile(uid) {
    try {
      const userProfile = await firebaseService.getUserProfile(uid);
      
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      
      return userProfile;
    } catch (error) {
      throw new Error(`Get profile failed: ${error.message}`);
    }
  }
  
  /**
   * Update user profile
   * @param {String} uid - User UID
   * @param {Object} profileData - Profile data to update
   */
  async updateProfile(uid, profileData) {
    try {
      const allowedFields = ['displayName', 'phoneNumber'];
      const updateData = {};
      
      // Only update allowed fields
      Object.keys(profileData).forEach(key => {
        if (allowedFields.includes(key) && profileData[key] !== undefined) {
          updateData[key] = profileData[key];
        }
      });
      
      if (Object.keys(updateData).length === 0) {
        throw new Error('No valid fields to update');
      }
      
      // Update user profile
      await firebaseService.updateUser(uid, updateData);
      
      return await this.getProfile(uid);
    } catch (error) {
      throw new Error(`Update profile failed: ${error.message}`);
    }
  }
  
  /**
   * Send password reset email
   * @param {String} email - User email
   */
  async resetPassword(email) {
    try {
      await firebaseService.auth.generatePasswordResetLink(email);
      return true;
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();