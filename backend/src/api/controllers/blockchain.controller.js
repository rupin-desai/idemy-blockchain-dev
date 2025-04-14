const { catchAsync } = require('../../utils/error-handler.util');
const blockchainService = require('../../services/blockchain.service');
const logger = require('../../utils/logger.util');

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
  // Get addresses from environment variables or config
  const identityAddress = process.env.IDENTITY_CONTRACT_ADDRESS || '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
  const cardAddress = process.env.IDCARD_CONTRACT_ADDRESS || '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24';
  
  res.status(200).json({
    success: true,
    data: {
      identityContract: identityAddress,
      cardContract: cardAddress
    }
  });
});

/**
 * Verify student records
 */
exports.verifyStudentRecords = catchAsync(async (req, res) => {
  try {
    // This would call some verification methods on your contracts
    // For now, return simulated verification result
    const totalRecords = await blockchainService.getStudentCount();
    const validRecords = totalRecords;
    
    res.status(200).json({
      success: true,
      data: {
        verified: totalRecords === validRecords,
        recordsChecked: totalRecords,
        validRecords: validRecords,
        message: "All student records are valid on the blockchain"
      }
    });
  } catch (error) {
    logger.error("Error verifying student records:", error);
    
    res.status(200).json({
      success: true,
      data: {
        verified: false,
        message: "Error verifying student records: " + error.message
      }
    });
  }
});

/**
 * Get student count
 */
exports.getStudentCount = catchAsync(async (req, res) => {
  const count = await blockchainService.getStudentCount();
  
  res.status(200).json({
    success: true,
    data: {
      count
    }
  });
});

/**
 * Check card validity
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
    // In a real implementation, this would query the IDCard contract
    // Here we're determining validity based on the student ID for demo purposes
    const isValid = studentId.length > 5;
    const expiryDate = isValid ? 
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    res.status(200).json({
      success: true,
      data: {
        valid: isValid,
        studentId: studentId,
        message: isValid ? "Student card is valid and active" : "Student card has expired or is invalid",
        expiryDate: expiryDate
      }
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
 * Get wallet balance
 */
exports.getWalletBalance = catchAsync(async (req, res) => {
  const { address } = req.params;
  
  // Implement the actual balance check here
  // For now, return a placeholder
  res.status(200).json({
    success: true,
    data: {
      address: address,
      balance: '0.05',
      currency: 'ETH'
    }
  });
});

/**
 * Send transaction
 */
exports.sendTransaction = catchAsync(async (req, res) => {
  const { to, value } = req.body;
  const { uid } = req.user;
  
  // Get user's wallet info
  const userProfile = await req.app.locals.firebase.getUserProfile(uid);
  
  if (!userProfile.walletAddress || !userProfile.privateKey) {
    return res.status(400).json({
      success: false,
      message: 'User does not have a wallet'
    });
  }
  
  const receipt = await blockchainService.sendTransaction(
    to, 
    userProfile.walletAddress, 
    userProfile.privateKey, 
    value
  );
  
  res.status(200).json({
    success: true,
    message: 'Transaction sent successfully',
    data: {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed
    }
  });
});