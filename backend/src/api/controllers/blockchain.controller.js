const blockchainService = require('../../blockchain/services/blockchain.service');
const { catchAsync } = require('../../utils/error-handler.util');

/**
 * Get blockchain network info
 */
exports.getNetworkInfo = catchAsync(async (req, res) => {
  const networkInfo = await blockchainService.getNetworkInfo();
  
  res.status(200).json({
    success: true,
    data: networkInfo
  });
});

/**
 * Get wallet balance
 */
exports.getWalletBalance = catchAsync(async (req, res) => {
  const { address } = req.params;
  
  const balance = await blockchainService.getBalance(address);
  
  res.status(200).json({
    success: true,
    data: {
      address,
      balance,
      unit: 'ETH'
    }
  });
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
      privateKey: wallet.privateKey
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