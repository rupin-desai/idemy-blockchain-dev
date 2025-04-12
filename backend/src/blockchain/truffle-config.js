const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider(
        '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', // First account's private key
        'http://127.0.0.1:8545'
      ),
      network_id: "*",
      gas: 5500000,
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.20", // Updated from 0.8.17 to 0.8.20
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },

  // DB for Ganache persistent blockchain
  db: {
    enabled: true,
    host: "127.0.0.1",
    adapter: {
      name: "indexeddb",
      settings: {
        directory: ".db",
      },
    },
  },
};
