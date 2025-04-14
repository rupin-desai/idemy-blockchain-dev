const ethers = require("ethers");
const crypto = require("crypto");
const config = require("../config");
const logger = require("../utils/logger.util");

// Load ABI files for contracts
const IdentityRegistryABI = require("../contracts/IdentityRegistry.json").abi;
const CredentialRegistryABI =
  require("../contracts/CredentialRegistry.json").abi;

// Initialize provider based on environment
let provider;
let identityRegistry;
let credentialRegistry;

/**
 * Initialize blockchain service
 */
const initialize = () => {
  try {
    // Connect to provider based on environment
    if (process.env.NODE_ENV === "production") {
      provider = new ethers.providers.JsonRpcProvider(config.blockchain.rpcUrl);
    } else {
      // For development/test, use a local provider
      provider = new ethers.providers.JsonRpcProvider(
        config.blockchain.devRpcUrl || "http://localhost:8545"
      );
    }

    // Connect to smart contracts if configured
    if (config.blockchain.identityRegistryAddress) {
      identityRegistry = new ethers.Contract(
        config.blockchain.identityRegistryAddress,
        IdentityRegistryABI,
        provider
      );
    }

    if (config.blockchain.credentialRegistryAddress) {
      credentialRegistry = new ethers.Contract(
        config.blockchain.credentialRegistryAddress,
        CredentialRegistryABI,
        provider
      );
    }

    logger.info("Blockchain service initialized");

    return true;
  } catch (error) {
    logger.error("Failed to initialize blockchain service:", error);
    return false;
  }
};

// Initialize on service load
initialize();

/**
 * Create a new wallet
 */
exports.createWallet = async () => {
  try {
    // Create a random private key with proper length (32 bytes)
    const privateKey = "0x" + crypto.randomBytes(32).toString("hex");

    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);

    logger.info(`Created wallet with address: ${wallet.address}`);

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    logger.error("Failed to create wallet:", error);
    throw new Error(`Failed to create wallet: ${error.message}`);
  }
};

/**
 * Get wallet from private key
 */
exports.getWallet = (privateKey) => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet;
  } catch (error) {
    logger.error("Failed to get wallet from private key:", error);
    throw new Error(`Failed to get wallet: ${error.message}`);
  }
};

/**
 * Register identity on the blockchain
 */
exports.registerIdentity = async (did, ipfsHash, address, privateKey) => {
  try {
    // Skip blockchain registration if in development mode without contract address
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.identityRegistryAddress
    ) {
      logger.warn("Skipping blockchain registration in development mode");
      return {
        transactionHash: `mock-tx-${crypto.randomBytes(32).toString("hex")}`,
        blockNumber: Math.floor(Date.now() / 1000),
      };
    }

    // Get wallet for sending transaction
    const wallet = privateKey
      ? this.getWallet(privateKey)
      : new ethers.Wallet.createRandom().connect(provider);

    // Connect contract with signer
    const contract = identityRegistry.connect(wallet);

    // Estimate gas for transaction
    const gasEstimate = await contract.estimateGas.registerIdentity(
      did,
      ipfsHash,
      address
    );

    // Prepare transaction with gas limit buffer
    const tx = await contract.registerIdentity(did, ipfsHash, address, {
      gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
    });

    // Wait for transaction confirmation
    const receipt = await tx.wait(1); // Wait for 1 confirmation

    logger.info(
      `Identity registered on blockchain: ${receipt.transactionHash}`
    );

    return receipt;
  } catch (error) {
    logger.error("Failed to register identity on blockchain:", error);
    throw new Error(
      `Failed to register identity on blockchain: ${error.message}`
    );
  }
};

/**
 * Verify if identity exists on blockchain
 */
exports.verifyIdentity = async (did) => {
  try {
    // Skip verification if in development mode without contract
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.identityRegistryAddress
    ) {
      logger.warn("Skipping identity verification in development mode");
      return true;
    }

    // Call contract to check if identity exists
    const exists = await identityRegistry.identityExists(did);

    return exists;
  } catch (error) {
    logger.error("Failed to verify identity on blockchain:", error);
    throw new Error(
      `Failed to verify identity on blockchain: ${error.message}`
    );
  }
};

/**
 * Get identity details from blockchain
 */
exports.getIdentity = async (did) => {
  try {
    // Skip if in development mode without contract
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.identityRegistryAddress
    ) {
      logger.warn("Skipping identity retrieval in development mode");
      return {
        did,
        ipfsHash: `mock-ipfs-${crypto.randomBytes(16).toString("hex")}`,
        owner: `0x${crypto.randomBytes(20).toString("hex")}`,
        status: 1, // Active
        createdAt: Math.floor(Date.now() / 1000),
      };
    }

    // Call contract to get identity details
    const identity = await identityRegistry.getIdentity(did);

    return {
      did,
      ipfsHash: identity.ipfsHash,
      owner: identity.owner,
      status: identity.status,
      createdAt: identity.createdAt.toNumber(),
    };
  } catch (error) {
    logger.error("Failed to get identity from blockchain:", error);
    throw new Error(`Failed to get identity from blockchain: ${error.message}`);
  }
};

/**
 * Update identity status on blockchain
 */
exports.updateIdentityStatus = async (did, status, privateKey) => {
  try {
    // Skip if in development mode without contract
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.identityRegistryAddress
    ) {
      logger.warn("Skipping identity status update in development mode");
      return {
        transactionHash: `mock-tx-${crypto.randomBytes(32).toString("hex")}`,
        blockNumber: Math.floor(Date.now() / 1000),
      };
    }

    // Get wallet for sending transaction
    const wallet = this.getWallet(privateKey);

    // Connect contract with signer
    const contract = identityRegistry.connect(wallet);

    // Convert status string to number if needed
    const statusCode =
      typeof status === "string"
        ? { active: 1, suspended: 2, revoked: 3 }[status.toLowerCase()] || 1
        : status;

    // Estimate gas for transaction
    const gasEstimate = await contract.estimateGas.updateIdentityStatus(
      did,
      statusCode
    );

    // Prepare transaction with gas limit buffer
    const tx = await contract.updateIdentityStatus(did, statusCode, {
      gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
    });

    // Wait for transaction confirmation
    const receipt = await tx.wait(1); // Wait for 1 confirmation

    logger.info(
      `Identity status updated on blockchain: ${receipt.transactionHash}`
    );

    return receipt;
  } catch (error) {
    logger.error("Failed to update identity status on blockchain:", error);
    throw new Error(
      `Failed to update identity status on blockchain: ${error.message}`
    );
  }
};

/**
 * Issue credential on blockchain
 */
exports.issueCredential = async (
  credentialId,
  issuerDid,
  subjectDid,
  ipfsHash,
  privateKey
) => {
  try {
    // Skip if in development mode without contract
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.credentialRegistryAddress
    ) {
      logger.warn("Skipping credential issuance in development mode");
      return {
        transactionHash: `mock-tx-${crypto.randomBytes(32).toString("hex")}`,
        blockNumber: Math.floor(Date.now() / 1000),
      };
    }

    // Get wallet for sending transaction
    const wallet = this.getWallet(privateKey);

    // Connect contract with signer
    const contract = credentialRegistry.connect(wallet);

    // Estimate gas for transaction
    const gasEstimate = await contract.estimateGas.issueCredential(
      credentialId,
      issuerDid,
      subjectDid,
      ipfsHash
    );

    // Prepare transaction with gas limit buffer
    const tx = await contract.issueCredential(
      credentialId,
      issuerDid,
      subjectDid,
      ipfsHash,
      {
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
      }
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait(1); // Wait for 1 confirmation

    logger.info(`Credential issued on blockchain: ${receipt.transactionHash}`);

    return receipt;
  } catch (error) {
    logger.error("Failed to issue credential on blockchain:", error);
    throw new Error(
      `Failed to issue credential on blockchain: ${error.message}`
    );
  }
};

/**
 * Verify credential status on blockchain
 */
exports.verifyCredential = async (credentialId) => {
  try {
    // Skip if in development mode without contract
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.credentialRegistryAddress
    ) {
      logger.warn("Skipping credential verification in development mode");
      return {
        isValid: true,
        status: 1, // Active
        issuerDid: `did:ethr:0x${crypto.randomBytes(20).toString("hex")}`,
        subjectDid: `did:ethr:0x${crypto.randomBytes(20).toString("hex")}`,
        ipfsHash: `mock-ipfs-${crypto.randomBytes(16).toString("hex")}`,
      };
    }

    // Call contract to check credential
    const credential = await credentialRegistry.getCredential(credentialId);

    return {
      isValid: credential.status === 1, // 1 = Active
      status: credential.status,
      issuerDid: credential.issuerDid,
      subjectDid: credential.subjectDid,
      ipfsHash: credential.ipfsHash,
    };
  } catch (error) {
    logger.error("Failed to verify credential on blockchain:", error);
    throw new Error(
      `Failed to verify credential on blockchain: ${error.message}`
    );
  }
};

/**
 * Revoke credential on blockchain
 */
exports.revokeCredential = async (credentialId, privateKey) => {
  try {
    // Skip if in development mode without contract
    if (
      process.env.NODE_ENV === "development" &&
      !config.blockchain.credentialRegistryAddress
    ) {
      logger.warn("Skipping credential revocation in development mode");
      return {
        transactionHash: `mock-tx-${crypto.randomBytes(32).toString("hex")}`,
        blockNumber: Math.floor(Date.now() / 1000),
      };
    }

    // Get wallet for sending transaction
    const wallet = this.getWallet(privateKey);

    // Connect contract with signer
    const contract = credentialRegistry.connect(wallet);

    // Estimate gas for transaction
    const gasEstimate =
      await contract.estimateGas.revokeCredential(credentialId);

    // Prepare transaction with gas limit buffer
    const tx = await contract.revokeCredential(credentialId, {
      gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
    });

    // Wait for transaction confirmation
    const receipt = await tx.wait(1); // Wait for 1 confirmation

    logger.info(`Credential revoked on blockchain: ${receipt.transactionHash}`);

    return receipt;
  } catch (error) {
    logger.error("Failed to revoke credential on blockchain:", error);
    throw new Error(
      `Failed to revoke credential on blockchain: ${error.message}`
    );
  }
};

/**
 * Get gas price
 */
exports.getGasPrice = async () => {
  try {
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  } catch (error) {
    logger.error("Failed to get gas price:", error);
    throw new Error(`Failed to get gas price: ${error.message}`);
  }
};

/**
 * Get network information
 */
exports.getNetworkInfo = async () => {
  try {
    const network = await provider.getNetwork();
    return network;
  } catch (error) {
    logger.error("Failed to get network information:", error);
    throw new Error(`Failed to get network information: ${error.message}`);
  }
};

module.exports = {
  ...exports,
  initialize,
  provider,
};
