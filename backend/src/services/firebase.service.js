const admin = require("firebase-admin");
const initializeFirebase = require("../config/firebase.config");
const logger = require('../utils/logger.util');

// Initialize Firebase Admin SDK
const firebaseAdmin = initializeFirebase();

class FirebaseService {
  constructor() {
    this.auth = firebaseAdmin.auth();
    this.db = firebaseAdmin.firestore();
    this.storage = firebaseAdmin.storage();
  }

  // User Authentication Methods
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error(`Firebase token verification failed: ${error.message}`);
    }
  }

  async getUserByUid(uid) {
    try {
      const userRecord = await this.auth.getUser(uid);
      return userRecord;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const userRecord = await this.auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
      });

      // Also create user in Firestore
      await this.db
        .collection("users")
        .doc(userRecord.uid)
        .set({
          uid: userRecord.uid,
          email: userData.email,
          displayName: userData.displayName || userData.email.split("@")[0],
          phoneNumber: userData.phoneNumber,
          role: userData.role || "user",
          isActive: true,
          profileCompleted: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return userRecord;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(uid, userData) {
    try {
      // Update in Auth
      await this.auth.updateUser(uid, userData);

      // Update in Firestore
      const updateData = { ...userData };
      delete updateData.password; // Don't store password in Firestore
      updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

      await this.db.collection("users").doc(uid).update(updateData);

      return await this.getUserByUid(uid);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async setCustomUserClaims(uid, claims) {
    try {
      await this.auth.setCustomUserClaims(uid, claims);
    } catch (error) {
      throw new Error(`Failed to set custom claims: ${error.message}`);
    }
  }

  // Firestore Methods
  async getUserProfile(uid) {
    try {
      const userDoc = await this.db.collection("users").doc(uid).get();
      if (!userDoc.exists) {
        return null;
      }
      return userDoc.data();
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  // Identity Methods
  async createIdentity(identityData) {
    try {
      logger.info('Creating identity in Firebase:', JSON.stringify(identityData));
      
      // Actual Firebase code...
      const docRef = await this.db.collection('identities').doc(identityData.uid || Math.random().toString(36).substring(2, 15));
      await docRef.set({
        ...identityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, id: docRef.id };
    } catch (error) {
      logger.error('Firebase error creating identity:', error);
      throw new Error(`Failed to create identity in database: ${error.message}`);
    }
  }

  async getIdentityByDid(did) {
    try {
      const snapshot = await this.db
        .collection("identities")
        .where("did", "==", did)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get identity: ${error.message}`);
    }
  }

  async getIdentityByUserId(userId) {
    try {
      const snapshot = await this.db
        .collection("identities")
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get identity: ${error.message}`);
    }
  }

  async updateIdentity(did, updateData) {
    try {
      const snapshot = await this.db
        .collection("identities")
        .where("did", "==", did)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error("Identity not found");
      }

      const doc = snapshot.docs[0];
      await doc.ref.update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Get the updated document
      const updatedDoc = await doc.ref.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      throw new Error(`Failed to update identity: ${error.message}`);
    }
  }

  async listIdentities(filters = {}, page = 1, limit = 10) {
    try {
      let query = this.db.collection("identities");

      // Apply filters
      if (filters.status) {
        query = query.where("identityStatus", "==", filters.status);
      }

      // Get total count
      const countSnapshot = await query.count().get();
      const total = countSnapshot.data().count;

      // Get paginated results
      const snapshot = await query
        .orderBy("createdAt", "desc")
        .limit(limit)
        .offset((page - 1) * limit)
        .get();

      const identities = [];
      snapshot.forEach((doc) => {
        identities.push({ id: doc.id, ...doc.data() });
      });

      return {
        identities,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to list identities: ${error.message}`);
    }
  }

  // Add this method to your Firebase service

  /**
   * Get all identities
   */
  async getAllIdentities() {
    try {
      const snapshot = await this.db.collection("identities").get();
      const identities = [];
      
      snapshot.forEach((doc) => {
        identities.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return identities;
    } catch (error) {
      throw new Error(`Failed to get identities: ${error.message}`);
    }
  }

  /**
   * Get identity by DID
   */
  async getIdentityByDID(did) {
    try {
      const snapshot = await this.db.collection("identities").where("did", "==", did).get();
      
      if (snapshot.empty) {
        throw new Error(`Identity with DID ${did} not found`);
      }
      
      let identity = null;
      
      snapshot.forEach((doc) => {
        identity = {
          id: doc.id,
          ...doc.data()
        };
      });
      
      return identity;
    } catch (error) {
      throw new Error(`Failed to get identity: ${error.message}`);
    }
  }

  /**
   * Update identity
   */
  async updateIdentity(did, data) {
    try {
      const snapshot = await this.db.collection("identities").where("did", "==", did).get();
      
      if (snapshot.empty) {
        throw new Error(`Identity with DID ${did} not found`);
      }
      
      const batch = this.db.batch();
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          ...data,
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      
      return true;
    } catch (error) {
      throw new Error(`Failed to update identity: ${error.message}`);
    }
  }

  // Document Methods
  async createDocument(documentData) {
    try {
      // Use documentId as the document ID in Firestore
      const ref = this.db.collection("documents").doc(documentData.documentId);

      await ref.set({
        ...documentData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const doc = await ref.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  async getDocumentById(documentId) {
    try {
      const doc = await this.db.collection("documents").doc(documentId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  async updateDocument(documentId, updateData) {
    try {
      const ref = this.db.collection("documents").doc(documentId);

      await ref.update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const doc = await ref.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  async getUserDocuments(userId) {
    try {
      const snapshot = await this.db
        .collection("documents")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      throw new Error(`Failed to get user documents: ${error.message}`);
    }
  }

  async getIdentityDocuments(did) {
    try {
      const snapshot = await this.db
        .collection("documents")
        .where("did", "==", did)
        .orderBy("createdAt", "desc")
        .get();

      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      throw new Error(`Failed to get identity documents: ${error.message}`);
    }
  }

  // Generic query method
  async query(
    collection,
    conditions = [],
    orderBy = null,
    limit = null,
    offset = null
  ) {
    try {
      let query = this.db.collection(collection);

      // Apply conditions
      conditions.forEach((condition) => {
        query = query.where(
          condition.field,
          condition.operator,
          condition.value
        );
      });

      // Apply orderBy
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || "asc");
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);

        if (offset) {
          query = query.offset(offset);
        }
      }

      const snapshot = await query.get();

      const results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      return results;
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  // Add this method to your Firebase service:

  /**
   * Create a new identity in Firebase
   */
  async createIdentity(identityData) {
    try {
      // For testing, just log the data instead of saving to Firebase
      logger.info('Creating identity in Firebase:', JSON.stringify(identityData));
      
      // If you have Firebase configured, uncomment the following:
      
      const docRef = await this.db.collection('identities').doc(identityData.uid);
      await docRef.set({
        ...identityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      
      return { success: true, id: identityData.uid };
    } catch (error) {
      logger.error('Firebase error creating identity:', error);
      throw new Error(`Failed to create identity in database: ${error.message}`);
    }
  }
}

module.exports = new FirebaseService();
