const { DID } = require("dids");
const { Ed25519Provider } = require("key-did-provider-ed25519");
const { getResolver } = require("key-did-resolver");
const { randomBytes } = require("crypto");
const { fromString, toString } = require("uint8arrays");
const didUtil = require("../utils/did.util");
const firebaseService = require("./firebase.service");
const ipfsService = require("./ipfs.service");
const blockchainService = require("../blockchain/services/blockchain.service");
const identityService = require("../blockchain/services/identity.service");
const { v4: uuidv4 } = require("uuid");
const ethers = require('ethers');
const crypto = require('crypto');
const logger = require('../utils/logger.util');

class SSIService {
  /**
   * Create DID from wallet address
   */
  async createDID(walletAddress) {
    try {
      // For testing, we'll use a mock DID based on the wallet address
      console.log(`Creating DID for wallet address: ${walletAddress}`);
      
      // Generate the private key for DID generation using ethers
      // Use a deterministic approach for development 
      const privateKeyData = ethers.utils.toUtf8Bytes(`${walletAddress}${process.env.SECRET_KEY}`);
      
      // Hash the data to ensure we get 32 bytes
      const hash = ethers.utils.keccak256(privateKeyData);
      
      // Create or get a wallet instance with proper private key length (32 bytes)
      const wallet = new ethers.Wallet(hash);
      
      // Create DID using the ethr-did library
      const did = `did:ethr:${wallet.address}`;
      
      console.log(`Created DID: ${did}`);
      
      return {
        did,
        publicKey: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error) {
      console.error('Failed to create DID:', error);
      throw new Error(`Failed to create DID: ${error.message}`);
    }
  }

  /**
   * Create a new identity
   * @param {Object} identityData - Identity data
   * @param {String} uid - User UID
   */
  async createIdentity(identityData, uid) {
    try {
      console.log("Creating identity for user:", uid);
      console.log("Identity data:", JSON.stringify(identityData, null, 2));
      
      // Get wallet address or create new one
      let walletAddress = identityData.walletAddress;
      if (!walletAddress) {
        const wallet = await blockchainService.createWallet();
        walletAddress = wallet.address;
        console.log("Created new wallet address:", walletAddress);
      }

      // Generate DID
      const { did } = await this.createDID(walletAddress);
      console.log("Generated DID:", did);

      // Prepare identity metadata for IPFS
      const identityMetadata = {
        did,
        personalInfo: identityData.personalInfo,
        address: identityData.address,
        contactInfo: identityData.contactInfo,
        studentInfo: identityData.studentInfo || {
          department: "cs",
          studentId: "ST" + Math.floor(10000 + Math.random() * 90000)
        },
        createdAt: new Date().toISOString(),
      };

      // Upload metadata to IPFS
      console.log("Uploading metadata to IPFS...");
      const ipfsHash = await ipfsService.uploadJSON(identityMetadata);
      console.log("Uploaded to IPFS, hash:", ipfsHash);

      // Save identity to blockchain
      console.log("Saving identity to blockchain...");
      const txReceipt = await identityService.createIdentity(
        did,
        ipfsHash,
        walletAddress
      );
      console.log("Blockchain transaction receipt:", txReceipt.transactionHash);

      // Create identity in Firebase
      console.log("Creating identity in Firebase...");
      const identity = await firebaseService.createIdentity({
        did,
        userId: uid,
        walletAddress,
        personalInfo: identityData.personalInfo,
        address: identityData.address,
        contactInfo: identityData.contactInfo,
        studentInfo: identityData.studentInfo || {
          department: "cs",
          studentId: "ST" + Math.floor(10000 + Math.random() * 90000)
        },
        identityStatus: "pending",
        ipfsMetadataHash: ipfsHash,
        blockchainTxHash: txReceipt.transactionHash,
      });
      console.log("Identity created successfully in Firebase");

      return identity;
    } catch (error) {
      console.error("Identity creation error:", error);
      throw new Error(`Failed to create identity: ${error.message}`);
    }
  }

  /**
   * Get identity
   * @param {String} did - DID
   */
  async getIdentity(did) {
    try {
      // Get identity from Firebase
      const identity = await firebaseService.getIdentityByDid(did);

      if (!identity) {
        throw new Error("Identity not found");
      }

      // Verify on blockchain
      const blockchainIdentity = await identityService.getIdentityByDid(did);

      // Get latest metadata from IPFS
      const ipfsData = await ipfsService.getJSON(identity.ipfsMetadataHash);

      return {
        identity,
        blockchainVerified: !!blockchainIdentity,
        ipfsData,
      };
    } catch (error) {
      throw new Error(`Failed to get identity: ${error.message}`);
    }
  }

  /**
   * Update identity
   * @param {String} did - DID
   * @param {Object} updateData - Update data
   */
  async updateIdentity(did, updateData) {
    try {
      // Get identity
      const identity = await firebaseService.getIdentityByDid(did);

      if (!identity) {
        throw new Error("Identity not found");
      }

      // Prepare updated metadata for IPFS
      const updatedMetadata = {
        did: identity.did,
        personalInfo: identity.personalInfo,
        address: updateData.address || identity.address,
        contactInfo: updateData.contactInfo || identity.contactInfo,
        updatedAt: new Date().toISOString(),
      };

      // Upload updated metadata to IPFS
      const ipfsHash = await ipfsService.uploadJSON(updatedMetadata);

      // Update metadata on blockchain
      const txReceipt = await identityService.updateIdentity(
        ipfsHash,
        identity.walletAddress
      );

      // Update identity in Firebase
      const updatedIdentity = await firebaseService.updateIdentity(did, {
        address: updateData.address,
        contactInfo: updateData.contactInfo,
        ipfsMetadataHash: ipfsHash,
        blockchainTxHash: txReceipt.transactionHash,
      });

      return updatedIdentity;
    } catch (error) {
      throw new Error(`Failed to update identity: ${error.message}`);
    }
  }

  /**
   * Verify identity
   * @param {String} did - DID
   * @param {String} status - Verification status
   * @param {String} verifierId - Verifier UID
   */
  async verifyIdentity(did, status, verifierId) {
    try {
      // Special handling for development admin user
      if (process.env.NODE_ENV === 'development' && verifierId === 'dev-admin-uid') {
        // Update identity status without requiring the verifier to exist
        const updatedIdentity = await firebaseService.updateIdentity(did, {
          identityStatus: status,
          verificationDate: new Date(),
          verifiedBy: verifierId,
        });

        return updatedIdentity;
      }
      
      // Standard flow for regular users
      // Update identity status
      const updatedIdentity = await firebaseService.updateIdentity(did, {
        identityStatus: status,
        verificationDate: new Date(),
        verifiedBy: verifierId,
      });

      return updatedIdentity;
    } catch (error) {
      throw new Error(`Failed to verify identity: ${error.message}`);
    }
  }

  /**
   * Create a new document
   * @param {Object} documentData - Document data
   * @param {Buffer} fileBuffer - Document file buffer
   */
  async createDocument(documentData, fileBuffer) {
    try {
      // Generate document ID
      const documentId = uuidv4();

      // Upload document to IPFS
      const ipfsHash = await ipfsService.uploadFile(
        fileBuffer,
        documentData.name
      );

      // Create document metadata
      const documentMetadata = {
        documentId,
        did: documentData.did,
        documentType: documentData.documentType,
        name: documentData.name,
        description: documentData.description,
        issuedBy: documentData.issuerName,
        issuedAt: new Date().toISOString(),
        expiryDate: documentData.expiryDate || null,
      };

      // Upload metadata to IPFS
      const ipfsMetadataHash = await ipfsService.uploadJSON(documentMetadata);

      // Register document on blockchain
      const txReceipt = await blockchainService.registerDocument(
        documentId,
        documentData.did,
        documentData.documentType,
        ipfsMetadataHash,
        documentData.issuerAddress
      );

      // Create document in Firebase
      const document = await firebaseService.createDocument({
        documentId,
        did: documentData.did,
        userId: documentData.userId,
        documentType: documentData.documentType,
        issuer: documentData.issuerId,
        issuerAddress: documentData.issuerAddress,
        name: documentData.name,
        description: documentData.description,
        ipfsHash,
        ipfsMetadataHash,
        issuanceDate: new Date(),
        expiryDate: documentData.expiryDate,
        status: "active",
        blockchainTxHash: txReceipt.transactionHash,
      });

      return document;
    } catch (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  /**
   * Get document
   * @param {String} documentId - Document ID
   */
  async getDocument(documentId) {
    try {
      // Get document from Firebase
      const document = await firebaseService.getDocumentById(documentId);

      if (!document) {
        throw new Error("Document not found");
      }

      // Verify document on blockchain
      const isValid = await blockchainService.isDocumentValid(documentId);

      // Get document metadata from IPFS
      const ipfsData = await ipfsService.getJSON(document.ipfsMetadataHash);

      // Get download URL
      const downloadUrl = ipfsService.getPublicUrl(document.ipfsHash);

      return {
        document,
        blockchainVerified: isValid,
        ipfsData,
        downloadUrl,
      };
    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }
}

module.exports = new SSIService();
