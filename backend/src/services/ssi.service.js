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

class SSIService {
  /**
   * Create a new DID
   * @param {String} walletAddress - Ethereum wallet address
   */
  async createDID(walletAddress) {
    try {
      // Generate a new DID using the wallet address
      const did = await didUtil.generateDid(walletAddress);

      return {
        did,
        walletAddress,
      };
    } catch (error) {
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
      // Get wallet address or create new one
      let walletAddress = identityData.walletAddress;
      if (!walletAddress) {
        const wallet = await blockchainService.createWallet();
        walletAddress = wallet.address;
      }

      // Generate DID
      const { did } = await this.createDID(walletAddress);

      // Prepare identity metadata for IPFS
      const identityMetadata = {
        did,
        personalInfo: identityData.personalInfo,
        address: identityData.address,
        contactInfo: identityData.contactInfo,
        createdAt: new Date().toISOString(),
      };

      // Upload metadata to IPFS
      const ipfsHash = await ipfsService.uploadJSON(identityMetadata);

      // Save identity to blockchain
      const txReceipt = await identityService.createIdentity(
        did,
        ipfsHash,
        walletAddress
      );

      // Create identity in Firebase
      const identity = await firebaseService.createIdentity({
        did,
        userId: uid,
        walletAddress,
        personalInfo: identityData.personalInfo,
        address: identityData.address,
        contactInfo: identityData.contactInfo,
        identityStatus: "pending",
        ipfsMetadataHash: ipfsHash,
        blockchainTxHash: txReceipt.transactionHash,
      });

      return identity;
    } catch (error) {
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
