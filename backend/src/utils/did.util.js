const { randomBytes } = require("crypto");
const { DID } = require("dids");
const { Ed25519Provider } = require("key-did-provider-ed25519");
const { getResolver } = require("key-did-resolver");
const { fromString } = require("uint8arrays");
const cryptoUtil = require("./crypto.util");

/**
 * Generate a new DID based on wallet address
 * @param {String} walletAddress - Ethereum wallet address
 */
const generateDid = async (walletAddress) => {
  // Use wallet address as a seed for deterministic DID generation
  const seed = fromString(
    cryptoUtil.hashData(walletAddress).slice(0, 32),
    "hex"
  );

  // Create a new DID using the Ed25519 provider
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });

  // Authenticate the DID
  await did.authenticate();

  return did.id;
};

/**
 * Generate a random DID
 */
const generateRandomDid = async () => {
  // Generate a random seed
  const seed = randomBytes(32);

  // Create a new DID using the Ed25519 provider
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });

  // Authenticate the DID
  await did.authenticate();

  return did.id;
};

/**
 * Validate a DID format
 * @param {String} did - DID to validate
 */
const validateDid = (did) => {
  // Basic validation pattern for DIDs
  const didPattern = /^did:([a-z0-9]+):([a-zA-Z0-9.%-]+)(\/[^/]+)*$/;
  return didPattern.test(did);
};

/**
 * Parse a DID into its components
 * @param {String} did - DID to parse
 */
const parseDid = (did) => {
  if (!validateDid(did)) {
    throw new Error("Invalid DID format");
  }

  const parts = did.split(":");

  return {
    method: parts[1],
    identifier: parts[2],
    path: parts.length > 3 ? `/${parts.slice(3).join("/")}` : undefined,
  };
};

module.exports = {
  generateDid,
  generateRandomDid,
  validateDid,
  parseDid,
};
