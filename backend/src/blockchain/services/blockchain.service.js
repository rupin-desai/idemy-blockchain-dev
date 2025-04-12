const Web3 = require("web3");
const ethers = require("ethers");
const config = require("../../config");
const Identity = require("../contracts/Identity.json");
const IDCard = require("../contracts/IDCard.json");
const DocumentRegistry = require("../contracts/DocumentRegistry.json");

class BlockchainService {
  constructor() {
    this.provider = new Web3.providers.HttpProvider(config.blockchain.provider);
    this.web3 = new Web3(this.provider);

    // Initialize contracts
    this.initContracts();
  }

  /**
   * Initialize blockchain contracts
   */
  initContracts() {
    try {
      this.identityContract = new this.web3.eth.Contract(
        Identity.abi,
        config.blockchain.contracts.identity.address
      );

      this.idCardContract = new this.web3.eth.Contract(
        IDCard.abi,
        config.blockchain.contracts.idCard.address
      );

      this.documentRegistryContract = new this.web3.eth.Contract(
        DocumentRegistry.abi,
        config.blockchain.contracts.documentRegistry.address
      );
    } catch (error) {
      console.error("Error initializing contracts:", error);
      // Continue without contracts - they will be initialized when addresses are available
    }
  }

  /**
   * Create a new Ethereum wallet
   */
  async createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  /**
   * Get network information
   */
  async getNetworkInfo() {
    try {
      const networkId = await this.web3.eth.net.getId();
      const blockNumber = await this.web3.eth.getBlockNumber();
      const gasPrice = await this.web3.eth.getGasPrice();

      return {
        networkId,
        blockNumber,
        gasPrice: this.web3.utils.fromWei(gasPrice, "gwei"),
        provider: config.blockchain.provider,
      };
    } catch (error) {
      throw new Error(`Failed to get network info: ${error.message}`);
    }
  }

  /**
   * Get account balance
   * @param {String} address - Ethereum address
   */
  async getBalance(address) {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return this.web3.utils.fromWei(balance, "ether");
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  /**
   * Send a transaction
   * @param {String} to - Recipient address
   * @param {String} from - Sender address
   * @param {String} privateKey - Sender private key
   * @param {String} value - Amount to send (in ether)
   */
  async sendTransaction(to, from, privateKey, value) {
    try {
      // Create transaction object
      const tx = {
        from,
        to,
        value: this.web3.utils.toWei(value, "ether"),
        gas: config.blockchain.gasLimit,
        gasPrice: config.blockchain.gasPrice,
      };

      // Sign transaction
      const signedTx = await this.web3.eth.accounts.signTransaction(
        tx,
        privateKey
      );

      // Send transaction
      const receipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      return receipt;
    } catch (error) {
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  /**
   * Register a document on the blockchain
   * @param {String} documentId - Document ID
   * @param {String} did - Identity DID
   * @param {String} documentType - Document type
   * @param {String} contentHash - IPFS hash of document content
   * @param {String} issuerAddress - Issuer's Ethereum address
   */
  async registerDocument(
    documentId,
    did,
    documentType,
    contentHash,
    issuerAddress
  ) {
    try {
      if (!this.documentRegistryContract) {
        throw new Error("Document registry contract not initialized");
      }

      // Create transaction data
      const data = this.documentRegistryContract.methods
        .registerDocument(documentId, did, documentType, contentHash)
        .encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        issuerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: issuerAddress,
        to: config.blockchain.contracts.documentRegistry.address,
        gas: config.blockchain.gasLimit,
        gasPrice: config.blockchain.gasPrice,
        nonce,
        data,
      };

      // Sign and send transaction
      const signedTx = await this.web3.eth.accounts.signTransaction(
        tx,
        config.blockchain.deployer.privateKey
      );

      const receipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      return receipt;
    } catch (error) {
      throw new Error(`Failed to register document: ${error.message}`);
    }
  }

  /**
   * Check if a document is valid
   * @param {String} documentId - Document ID
   */
  async isDocumentValid(documentId) {
    try {
      if (!this.documentRegistryContract) {
        throw new Error("Document registry contract not initialized");
      }

      const isValid = await this.documentRegistryContract.methods
        .isDocumentValid(documentId)
        .call();

      return isValid;
    } catch (error) {
      throw new Error(`Failed to check document validity: ${error.message}`);
    }
  }

  /**
   * Revoke a document
   * @param {String} documentId - Document ID
   * @param {String} issuerAddress - Issuer's Ethereum address
   */
  async revokeDocument(documentId, issuerAddress) {
    try {
      if (!this.documentRegistryContract) {
        throw new Error("Document registry contract not initialized");
      }

      // Create transaction data
      const data = this.documentRegistryContract.methods
        .revokeDocument(documentId)
        .encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        issuerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: issuerAddress,
        to: config.blockchain.contracts.documentRegistry.address,
        gas: config.blockchain.gasLimit,
        gasPrice: config.blockchain.gasPrice,
        nonce,
        data,
      };

      // Sign and send transaction
      const signedTx = await this.web3.eth.accounts.signTransaction(
        tx,
        config.blockchain.deployer.privateKey
      );

      const receipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      return receipt;
    } catch (error) {
      throw new Error(`Failed to revoke document: ${error.message}`);
    }
  }
}

module.exports = new BlockchainService();
