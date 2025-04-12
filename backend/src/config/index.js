const appConfig = require("./app.config");
const blockchainConfig = require("./blockchain.config");
const firebaseConfig = require("./firebase.config"); // This now exports a function
const ipfsConfig = require("./ipfs.config");

module.exports = {
  app: appConfig,
  blockchain: blockchainConfig,
  firebase: firebaseConfig, // This is a function now
  ipfs: ipfsConfig,
};
