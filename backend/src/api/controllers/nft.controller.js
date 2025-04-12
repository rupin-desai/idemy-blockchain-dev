const nftService = require('../../blockchain/services/nft.service');
const firebaseService = require('../../services/firebase.service');
const ipfsService = require('../../services/ipfs.service');
const { catchAsync, AppError } = require('../../utils/error-handler.util');

/**
 * Mint new ID Card as NFT
 */
exports.mintIDCard = catchAsync(async (req, res) => {
  const { did } = req.params;
  const { uid } = req.user;
  
  // Check if identity exists and belongs to the user
  const identity = await firebaseService.getIdentityByDid(did);
  
  if (!identity) {
    throw new AppError('Identity not found', 404);
  }
  
  if (identity.userId !== uid) {
    throw new AppError('Permission denied: you can only mint NFT for your own identity', 403);
  }
  
  // Check if identity is verified
  if (identity.identityStatus !== 'verified') {
    throw new AppError('Identity must be verified before minting an ID Card NFT', 400);
  }
  
  // Check if NFT already minted
  if (identity.idCardTokenId) {
    throw new AppError('ID Card NFT already minted for this identity', 400);
  }
  
  // Prepare NFT metadata
  const nftMetadata = {
    name: `ID Card for ${identity.personalInfo.firstName} ${identity.personalInfo.lastName}`,
    description: `Digital ID Card for ${did}`,
    image: `https://identicons.dev/identicon?seed=${did}`, // Placeholder image
    attributes: [
      {
        trait_type: "First Name",
        value: identity.personalInfo.firstName
      },
      {
        trait_type: "Last Name",
        value: identity.personalInfo.lastName
      },
      {
        trait_type: "DID",
        value: did
      },
      {
        trait_type: "Issue Date",
        value: new Date().toISOString().split('T')[0]
      }
    ]
  };
  
  // Upload metadata to IPFS
  const ipfsHash = await ipfsService.uploadJSON(nftMetadata);
  const tokenURI = `ipfs://${ipfsHash}`;
  
  // Mint NFT
  const { receipt, tokenId } = await nftService.mintIDCard(
    identity.walletAddress,
    did,
    tokenURI,
    identity.walletAddress
  );
  
  // Update identity in Firebase
  await firebaseService.updateIdentity(did, {
    idCardTokenId: tokenId,
    idCardMetadataHash: ipfsHash,
    idCardMintTx: receipt.transactionHash
  });
  
  res.status(201).json({
    success: true,
    message: 'ID Card NFT minted successfully',
    data: {
      tokenId,
      transactionHash: receipt.transactionHash,
      metadataURI: tokenURI,
      ipfsHash
    }
  });
});

/**
 * Link document to ID Card
 */
exports.linkDocument = catchAsync(async (req, res) => {
  const { tokenId, documentId } = req.params;
  const { uid } = req.user;
  
  // Get user identity
  const userIdentity = await firebaseService.getIdentityByUserId(uid);
  
  if (!userIdentity) {
    throw new AppError('Identity not found', 404);
  }
  
  // Check if token ID matches the user's ID card
  if (userIdentity.idCardTokenId !== parseInt(tokenId)) {
    throw new AppError('Permission denied: you can only link documents to your own ID Card', 403);
  }
  
  // Check if document exists
  const document = await firebaseService.getDocumentById(documentId);
  
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  // Check if document belongs to the user
  if (document.did !== userIdentity.did) {
    throw new AppError('Permission denied: you can only link your own documents', 403);
  }
  
  // Link document to NFT
  const receipt = await nftService.linkDocument(
    parseInt(tokenId),
    documentId,
    userIdentity.walletAddress
  );
  
  // Update document in Firebase
  await firebaseService.updateDocument(documentId, {
    linkedToIdCard: true,
    linkTx: receipt.transactionHash
  });
  
  res.status(200).json({
    success: true,
    message: 'Document linked to ID Card successfully',
    data: {
      tokenId,
      documentId,
      transactionHash: receipt.transactionHash
    }
  });
});

/**
 * Get ID Card details
 */
exports.getIDCard = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  // Get identity
  const identity = await firebaseService.getIdentityByDid(did);
  
  if (!identity) {
    throw new AppError('Identity not found', 404);
  }
  
  if (!identity.idCardTokenId) {
    throw new AppError('ID Card NFT not found for this identity', 404);
  }
  
  // Get token URI
  const tokenURI = await nftService.getTokenURI(identity.idCardTokenId);
  
  // Get metadata from IPFS
  let metadata = null;
  if (identity.idCardMetadataHash) {
    metadata = await ipfsService.getJSON(identity.idCardMetadataHash);
  }
  
  // Get linked documents
  const linkedDocumentIds = await nftService.getLinkedDocuments(identity.idCardTokenId);
  const linkedDocuments = [];
  
  for (const documentId of linkedDocumentIds) {
    const doc = await firebaseService.getDocumentById(documentId);
    if (doc) {
      linkedDocuments.push(doc);
    }
  }
  
  res.status(200).json({
    success: true,
    data: {
      tokenId: identity.idCardTokenId,
      did: identity.did,
      tokenURI,
      metadata,
      linkedDocuments
    }
  });
});

/**
 * Get token by DID
 */
exports.getTokenByDID = catchAsync(async (req, res) => {
  const { did } = req.params;
  
  // Check if identity exists
  const identity = await firebaseService.getIdentityByDid(did);
  
  if (!identity) {
    throw new AppError('Identity not found', 404);
  }
  
  // If token ID is already stored, return it
  if (identity.idCardTokenId) {
    return res.status(200).json({
      success: true,
      data: {
        tokenId: identity.idCardTokenId
      }
    });
  }
  
  // Otherwise, query blockchain
  try {
    const tokenId = await nftService.getTokenByDID(did);
    
    // Update identity in Firebase
    await firebaseService.updateIdentity(did, {
      idCardTokenId: tokenId
    });
    
    res.status(200).json({
      success: true,
      data: {
        tokenId
      }
    });
  } catch (error) {
    throw new AppError('ID Card NFT not found for this identity', 404);
  }
});