const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      websockets: true
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1337",
      websockets: true
    },
    goerli: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC, 
        `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",
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
        directory: ".db"
      }
    }
  }
};