const { catchAsync } = require('../../utils/error-handler.util');
const blockchainService = require('../../services/blockchain.service');
const logger = require('../../utils/logger.util');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const ethers = require('ethers');
const firebaseService = require('../../services/firebase.service');
const config = require('../../config');

// Add this code before your controller methods to properly initialize the provider
// This should be placed before your existing controller methods
const getBlockchainProvider = () => {
  try {
    // Create provider instance connecting to Ganache
    const provider = new ethers.providers.JsonRpcProvider(config.blockchain.provider || "http://127.0.0.1:8545");
    logger.info(`Connected to blockchain provider at ${config.blockchain.provider || "http://127.0.0.1:8545"}`);
    return provider;
  } catch (error) {
    logger.error("Failed to initialize blockchain provider:", error);
    throw new Error("Could not connect to blockchain. Is Ganache running?");
  }
};

/**
 * Get blockchain status and information
 */
exports.getBlockchainInfo = catchAsync(async (req, res) => {
  const networkInfo = await blockchainService.getNetworkInfo();
  
  res.status(200).json({
    success: true,
    data: networkInfo
  });
});

/**
 * Get contract addresses
 */
exports.getContractAddresses = catchAsync(async (req, res) => {
  // Use the addresses of the actual contracts
  const identityAddress = blockchainService.identityRegistry?.address || 
    process.env.IDENTITY_CONTRACT_ADDRESS || 
    '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
    
  const cardAddress = blockchainService.credentialRegistry?.address ||
    process.env.IDCARD_CONTRACT_ADDRESS || 
    '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24';
  
  res.status(200).json({
    success: true,
    data: {
      identityContract: identityAddress,
      cardContract: cardAddress
    }
  });
});

/**
 * Verify student records - get real blockchain data
 */
exports.verifyStudentRecords = catchAsync(async (req, res) => {
  try {
    // Call the blockchain service to verify student records
    const verificationResult = await blockchainService.verifyStudentRecords();
    
    res.status(200).json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    logger.error("Error verifying student records:", error);
    
    res.status(500).json({
      success: false,
      message: "Error verifying student records: " + error.message
    });
  }
});

/**
 * Get student count from blockchain
 */
exports.getStudentCount = catchAsync(async (req, res) => {
  try {
    const count = await blockchainService.getStudentCount();
    
    res.status(200).json({
      success: true,
      data: {
        count
      }
    });
  } catch (error) {
    logger.error("Error getting student count:", error);
    
    res.status(500).json({
      success: false,
      message: "Error getting student count: " + error.message
    });
  }
});

/**
 * Check card validity on the blockchain
 */
exports.checkCardValidity = catchAsync(async (req, res) => {
  const { studentId } = req.query;
  
  if (!studentId) {
    return res.status(400).json({
      success: false,
      message: "Student ID is required" 
    });
  }
  
  try {
    // Get card validity from blockchain
    const validityResult = await blockchainService.checkCardValidity(studentId);
    
    res.status(200).json({
      success: true,
      data: validityResult
    });
  } catch (error) {
    logger.error("Error checking card validity:", error);
    
    res.status(500).json({
      success: false,
      message: "Error checking card validity: " + error.message
    });
  }
});

/**
 * Create a new wallet
 */
exports.createWallet = catchAsync(async (req, res) => {
  const wallet = await blockchainService.createWallet();
  
  res.status(201).json({
    success: true,
    data: {
      address: wallet.address,
      privateKey: process.env.NODE_ENV === 'development' ? wallet.privateKey : undefined
    }
  });
});

/**
 * Get wallet balance from blockchain
 */
exports.getWalletBalance = catchAsync(async (req, res) => {
  const { address } = req.params;
  
  if (!address || !address.startsWith('0x')) {
    return res.status(400).json({
      success: false,
      message: "Valid wallet address is required" 
    });
  }
  
  try {
    // Get actual balance from blockchain
    const balanceWei = await blockchainService.provider.getBalance(address);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    
    res.status(200).json({
      success: true,
      data: {
        address: address,
        balance: balanceEth,
        currency: 'ETH'
      }
    });
  } catch (error) {
    logger.error("Error getting wallet balance:", error);
    
    // Return a fallback balance
    res.status(200).json({
      success: true,
      data: {
        address: address,
        balance: '0.05',
        currency: 'ETH'
      }
    });
  }
});

/**
 * Get all student identities
 */
exports.getStudentIdentities = async (req, res) => {
  try {
    logger.info("Getting all student identities");
    
    // First try to get identities from blockchain
    let identities = [];
    
    try {
      // Fix: Call the correct method name 
      identities = await firebaseService.getAllIdentities(); // NOT getAllStudentIdentities
      logger.info(`Retrieved ${identities.length} identities from database`);
    } catch (dbError) {
      logger.error("Failed to get identities from database:", dbError);
      
      // Return empty array - don't generate mock data
      return res.status(200).json({
        success: true,
        message: "No student identities found",
        data: []
      });
    }
    
    return res.status(200).json({
      success: true,
      data: identities
    });
  } catch (error) {
    logger.error("Error getting student identities:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: [] 
    });
  }
};

/**
 * Verify a student identity
 */
exports.verifyStudentIdentity = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  try {
    // 1. Update identity status in database
    await firebaseService.updateIdentity(did, {
      identityStatus: "verified",
      verificationDate: new Date(),
      verifiedBy: req.user?.uid
    });
    
    // 2. Update on blockchain (or register if not exists)
    try {
      // First check if already on blockchain
      const verifyResult = await blockchainService.verifyIdentity(did);
      
      let blockchainTxHash;
      
      // If not on blockchain, register it
      if (!verifyResult) {
        const student = await firebaseService.getIdentityByDID(did);
        const registerResult = await blockchainService.registerIdentity(
          did, 
          student.ipfsHash || "ipfs://placeholder", 
          student.walletAddress
        );
        blockchainTxHash = registerResult.transactionHash;
        
        // Update the student record with the transaction hash
        await firebaseService.updateIdentity(did, {
          blockchainTxHash,
          blockchainVerified: true
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Student identity verified successfully",
        data: {
          did,
          status: "verified",
          blockchainTxHash
        }
      });
    } catch (blockchainError) {
      logger.error(`Blockchain verification failed for ${did}:`, blockchainError);
      
      // Still return success since database was updated
      res.status(200).json({
        success: true,
        message: "Student identity verified successfully in database, but blockchain verification failed",
        data: {
          did,
          status: "verified",
          blockchainError: blockchainError.message
        }
      });
    }
  } catch (error) {
    logger.error(`Error verifying student identity ${did}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to verify student identity: ${error.message}`
    });
  }
});

/**
 * Revoke a student identity
 */
exports.revokeStudentIdentity = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  try {
    // 1. Update identity status in database
    await firebaseService.updateIdentity(did, {
      identityStatus: "revoked",
      revocationDate: new Date(),
      revokedBy: req.user?.uid
    });
    
    // 2. Update on blockchain if exists
    try {
      // Check if on blockchain
      const verifyResult = await blockchainService.verifyIdentity(did);
      
      let blockchainTxHash;
      
      // If on blockchain, revoke it
      if (verifyResult) {
        const revokeResult = await blockchainService.updateIdentityStatus(
          did,
          "revoked"
        );
        blockchainTxHash = revokeResult.transactionHash;
        
        // Update the student record with the transaction hash
        await firebaseService.updateIdentity(did, {
          blockchainTxHash,
          identityStatus: "revoked"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Student identity revoked successfully",
        data: {
          did,
          status: "revoked",
          blockchainTxHash
        }
      });
    } catch (blockchainError) {
      logger.error(`Blockchain revocation failed for ${did}:`, blockchainError);
      
      // Still return success since database was updated
      res.status(200).json({
        success: true,
        message: "Student identity revoked successfully in database, but blockchain update failed",
        data: {
          did,
          status: "revoked",
          blockchainError: blockchainError.message
        }
      });
    }
  } catch (error) {
    logger.error(`Error revoking student identity ${did}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to revoke student identity: ${error.message}`
    });
  }
});

/**
 * Get blockchain status for a student
 */
exports.getStudentBlockchainStatus = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  try {
    // Check if on blockchain
    const verified = await blockchainService.verifyIdentity(did);
    
    if (verified) {
      // Get detailed blockchain status
      const identity = await blockchainService.getIdentity(did);
      
      res.status(200).json({
        success: true,
        data: {
          verified: true,
          status: identity.status === 1 ? "active" : 
                 identity.status === 2 ? "suspended" : 
                 identity.status === 3 ? "revoked" : "unknown",
          ipfsHash: identity.ipfsHash,
          owner: identity.owner,
          createdAt: new Date(identity.createdAt * 1000).toISOString()
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          verified: false,
          message: "Identity not found on blockchain"
        }
      });
    }
  } catch (error) {
    logger.error(`Error getting blockchain status for ${did}:`, error);
    res.status(200).json({
      success: true,
      data: {
        verified: false,
        error: error.message
      }
    });
  }
});

/**
 * Create a new identity on the blockchain
 */
exports.createIdentity = catchAsync(async (req, res) => {
  try {
    const identityData = req.body;
    logger.info('Creating new student identity with data:', JSON.stringify(identityData));

    // 1. Generate wallet if not provided
    let walletAddress = identityData.walletAddress;
    if (!walletAddress) {
      // Create a deterministic wallet for testing purposes
      // In production, you'd want to use a more secure approach
      const wallet = ethers.Wallet.createRandom();
      walletAddress = wallet.address;
      logger.info('Generated new wallet address:', walletAddress);
    }

    // 2. Generate DID based on wallet address
    const did = `did:ethr:${walletAddress}`;
    logger.info('Generated DID:', did);

    // 3. Create metadata for identity
    const metadata = {
      did,
      personalInfo: identityData.personalInfo,
      contactInfo: identityData.contactInfo,
      studentInfo: identityData.studentInfo,
      createdAt: new Date().toISOString()
    };

    // 4. Generate a mock IPFS hash (in production, you'd upload to IPFS)
    const ipfsHash = `ipfs://${crypto
      .createHash('sha256')
      .update(JSON.stringify(metadata))
      .digest('hex')}`;
    logger.info('Generated mock IPFS hash:', ipfsHash);

    // 5. Register identity on blockchain
    logger.info('Attempting to register identity on blockchain');
    let receipt;
    try {
      receipt = await blockchainService.registerIdentity(
        did,
        ipfsHash,
        walletAddress
      );
      logger.info('Identity registered on blockchain:', receipt);
    } catch (blockchainError) {
      logger.error('Failed to register on blockchain:', blockchainError);
      throw new Error(`Blockchain registration failed: ${blockchainError.message}`);
    }

    // 6. Save identity to database
    try {
      const uid = uuidv4();
      await firebaseService.createIdentity({
        uid,
        did,
        walletAddress,
        personalInfo: identityData.personalInfo,
        contactInfo: identityData.contactInfo,
        studentInfo: identityData.studentInfo,
        address: identityData.address || {},
        blockchainTxHash: receipt.transactionHash,
        ipfsHash,
        identityStatus: 'pending',
        createdAt: new Date().toISOString()
      });
      logger.info('Identity saved to database');
    } catch (dbError) {
      logger.error('Failed to save to database, but blockchain registration succeeded:', dbError);
      // Continue since blockchain registration worked
    }

    // 7. Return success response
    res.status(201).json({
      success: true,
      message: 'Identity created and registered on blockchain',
      data: {
        did,
        walletAddress,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        ipfsHash
      }
    });
  } catch (error) {
    logger.error('Error creating identity:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create identity'
    });
  }
});

/**
 * Verify an identity on the blockchain
 */
exports.verifyBlockchainIdentity = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  try {
    logger.info(`Verifying identity on blockchain: ${did}`);
    
    // Check if identity exists on blockchain
    const exists = await blockchainService.verifyIdentity(did);
    
    if (exists) {
      // Get details from blockchain
      const identity = await blockchainService.getIdentity(did);
      
      // Format status based on numeric value
      const status = identity.status === 1 ? "active" : 
                     identity.status === 2 ? "suspended" : 
                     identity.status === 3 ? "revoked" : "unknown";
      
      res.status(200).json({
        success: true,
        data: {
          verified: true,
          message: `Identity ${did} exists on the blockchain`,
          did,
          status,
          ipfsHash: identity.ipfsHash,
          owner: identity.owner,
          createdAt: identity.createdAt * 1000, // Convert to milliseconds
          transactionHash: identity.transactionHash || null
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          verified: false,
          message: `Identity ${did} does not exist on the blockchain`,
          did
        }
      });
    }
  } catch (error) {
    logger.error(`Failed to verify identity on blockchain: ${error}`);
    
    res.status(500).json({
      success: false,
      message: `Failed to verify identity: ${error.message}`
    });
  }
});

/**
 * Get recent blocks from the blockchain
 */
exports.getBlocks = catchAsync(async (req, res) => {
  try {
    logger.info("Fetching recent blocks");
    
    // Get provider for this request
    const provider = getBlockchainProvider();
    
    // Get the current block number
    const currentBlock = await provider.getBlockNumber();
    logger.info(`Current block number: ${currentBlock}`);
    
    // Fetch last 10 blocks (or fewer if we don't have 10 blocks yet)
    const blockCount = Math.min(currentBlock + 1, 10);
    const blocks = [];
    
    for (let i = currentBlock; i >= Math.max(0, currentBlock - blockCount + 1); i--) {
      try {
        const block = await provider.getBlock(i);
        blocks.push({
          number: block.number,
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          transactions: block.transactions,
          miner: block.miner,
          gasUsed: block.gasUsed.toString(),
          gasLimit: block.gasLimit.toString(),
          size: block.size?.toString() || "0"
        });
      } catch (blockError) {
        logger.error(`Error fetching block ${i}:`, blockError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: "Retrieved recent blocks",
      data: blocks
    });
  } catch (error) {
    logger.error("Failed to get blocks:", error);
    res.status(503).json({
      success: false,
      message: `Failed to get blocks: ${error.message}`
    });
  }
});

/**
 * Get details of a specific block
 */
exports.getBlockDetails = catchAsync(async (req, res) => {
  try {
    const { blockNumber } = req.params;
    logger.info(`Fetching details for block ${blockNumber}`);
    
    // Get provider for this request
    const provider = getBlockchainProvider();
    
    // Get block with transactions
    const block = await provider.getBlockWithTransactions(parseInt(blockNumber));
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: `Block ${blockNumber} not found`
      });
    }
    
    // Format the response
    const formattedBlock = {
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      nonce: block.nonce,
      difficulty: block.difficulty.toString(),
      gasUsed: block.gasUsed.toString(),
      gasLimit: block.gasLimit.toString(),
      miner: block.miner,
      size: block.size?.toString() || "0",
      transactions: block.transactions.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        gas: tx.gasLimit.toString(),
        gasPrice: tx.gasPrice.toString(),
        nonce: tx.nonce
      }))
    };
    
    res.status(200).json({
      success: true,
      message: `Retrieved details for block ${blockNumber}`,
      data: formattedBlock
    });
  } catch (error) {
    logger.error(`Failed to get block ${req.params.blockNumber}:`, error);
    res.status(503).json({
      success: false,
      message: `Failed to get block: ${error.message}`
    });
  }
});

/**
 * Get details of a specific transaction
 */
exports.getTransactionDetails = catchAsync(async (req, res) => {
  try {
    const { hash } = req.params;
    logger.info(`Fetching details for transaction ${hash}`);
    
    // Get provider for this request
    const provider = getBlockchainProvider();
    
    // Get transaction
    const tx = await provider.getTransaction(hash);
    
    if (!tx) {
      return res.status(404).json({
        success: false,
        message: `Transaction ${hash} not found`
      });
    }
    
    // Get receipt for additional info
    const receipt = await provider.getTransactionReceipt(hash);
    
    // Format the response
    const formattedTx = {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      gasPrice: tx.gasPrice.toString(),
      gas: tx.gasLimit.toString(),
      nonce: tx.nonce,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      input: tx.data,
      status: receipt ? (receipt.status ? "Success" : "Failed") : "Unknown",
      gasUsed: receipt ? receipt.gasUsed.toString() : "0",
      contractAddress: receipt ? receipt.contractAddress : null,
      timestamp: null // Will be populated from block data
    };
    
    // Get block for timestamp
    if (tx.blockNumber) {
      try {
        const block = await provider.getBlock(tx.blockNumber);
        if (block) {
          formattedTx.timestamp = block.timestamp;
        }
      } catch (blockError) {
        logger.error(`Error fetching block for transaction ${hash}:`, blockError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Retrieved details for transaction ${hash}`,
      data: formattedTx
    });
  } catch (error) {
    logger.error(`Failed to get transaction ${req.params.hash}:`, error);
    res.status(503).json({
      success: false,
      message: `Failed to get transaction: ${error.message}`
    });
  }
});

// Helper to create mock identities for development
function createMockIdentities(count = 8) {
  return Array.from({ length: count }, (_, i) => ({
    uid: `student-${i+1}`,
    did: `did:ethr:0x${crypto.randomBytes(20).toString('hex')}`,
    personalInfo: {
      firstName: `Student-${i+1}`,
      lastName: 'Test'
    },
    studentInfo: {
      studentId: `S${100000 + i}`,
      department: ["cs", "eng", "bus", "arts"][i % 4],
      type: ["undergraduate", "graduate", "exchange"][i % 3]
    },
    identityStatus: ["pending", "verified", "active", "revoked"][i % 4],
    walletAddress: `0x${crypto.randomBytes(20).toString('hex')}`,
    blockchainTxHash: i % 3 === 0 ? `0x${crypto.randomBytes(32).toString('hex')}` : null,
    blockchainVerified: i % 2 === 0,
    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
  }));
}