const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  provider: process.env.BLOCKCHAIN_PROVIDER || "http://127.0.0.1:8545",
  networkId: parseInt(process.env.BLOCKCHAIN_NETWORK_ID) || 1337,
  gasPrice: parseInt(process.env.BLOCKCHAIN_GAS_PRICE) || 20000000000,
  gasLimit: parseInt(process.env.BLOCKCHAIN_GAS_LIMIT) || 6721975,
  deployer: {
    address: process.env.DEPLOYER_ADDRESS,
    privateKey: process.env.DEPLOYER_PRIVATE_KEY,
  },
  contracts: {
    identity: {
      name: "Identity",
      address: process.env.IDENTITY_CONTRACT_ADDRESS,
    },
    idCard: {
      name: "IDCard",
      address: process.env.IDCARD_CONTRACT_ADDRESS,
    },
    documentRegistry: {
      name: "DocumentRegistry",
      address: process.env.DOCUMENT_REGISTRY_CONTRACT_ADDRESS,
    },
  },
};
