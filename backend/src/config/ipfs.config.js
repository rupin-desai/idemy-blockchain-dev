const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  apiUrl: process.env.IPFS_API_URL || "https://api.pinata.cloud/pinning",
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    secretApiKey: process.env.PINATA_SECRET_API_KEY,
  },
  gateway: process.env.IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/",
};
