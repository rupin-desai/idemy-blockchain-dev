const crypto = require("crypto");
const ethers = require("ethers");

/**
 * Generate a random key pair
 */
const generateKeyPair = () => {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
};

/**
 * Sign data with private key
 * @param {String} data - Data to sign
 * @param {String} privateKey - Private key in PEM format
 */
const signData = (data, privateKey) => {
  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, "base64");
};

/**
 * Verify signature
 * @param {String} data - Original data
 * @param {String} signature - Signature to verify
 * @param {String} publicKey - Public key in PEM format
 */
const verifySignature = (data, signature, publicKey) => {
  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, "base64");
};

/**
 * Hash data using SHA-256
 * @param {String} data - Data to hash
 */
const hashData = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

/**
 * Generate a random seed for wallet generation
 */
const generateRandomSeed = () => {
  return ethers.Wallet.createRandom().mnemonic.phrase;
};

/**
 * Generate an Ethereum wallet from seed
 * @param {String} seed - Mnemonic seed
 */
const generateWalletFromSeed = (seed) => {
  const wallet = ethers.Wallet.fromMnemonic(seed);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

module.exports = {
  generateKeyPair,
  signData,
  verifySignature,
  hashData,
  generateRandomSeed,
  generateWalletFromSeed,
};
