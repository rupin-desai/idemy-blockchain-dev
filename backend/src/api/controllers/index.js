const authController = require('./auth.controller');
const identityController = require('./identity.controller');
const documentController = require('./document.controller');
const nftController = require('./nft.controller');
const blockchainController = require('./blockchain.controller');

module.exports = {
  auth: authController,
  identity: identityController,
  document: documentController,
  nft: nftController,
  blockchain: blockchainController
};