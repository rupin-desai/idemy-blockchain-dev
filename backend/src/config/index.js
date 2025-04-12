const appConfig = require("./app.config");
const blockchainConfig = require("./blockchain.config");
const firebaseConfig = require("./firebase.config");
const ipfsConfig = require("./ipfs.config");

module.exports = {
  app: appConfig,
  blockchain: blockchainConfig,
  firebase: firebaseConfig,
  ipfs: ipfsConfig,
};
