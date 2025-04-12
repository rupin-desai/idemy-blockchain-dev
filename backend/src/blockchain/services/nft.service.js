const Web3 = require("web3");
const config = require("../../config");
const IDCard = require("../build/contracts/IDCard.json");

class NFTService {
  constructor() {
    this.provider = new Web3.providers.HttpProvider(config.blockchain.provider);
    this.web3 = new Web3(this.provider);

    // Initialize contract if address is available
    if (config.blockchain.contracts.idCard.address) {
      this.contract = new this.web3.eth.Contract(
        IDCard.abi,
        config.blockchain.contracts.idCard.address
      );
    }
  }

  /**
   * Mint a new ID Card NFT
   * @param {String} to - Recipient address
   * @param {String} did - DID of the identity
   * @param {String} tokenURI - IPFS URI for the token metadata
   * @param {String} senderAddress - Sender's address
   */
  async mintIDCard(to, did, tokenURI, senderAddress) {
    try {
      if (!this.contract) {
        throw new Error("IDCard contract not initialized");
      }

      // Create transaction data
      const data = this.contract.methods
        .mintIDCard(to, did, tokenURI)
        .encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        senderAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: senderAddress,
        to: config.blockchain.contracts.idCard.address,
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

      // Get token ID from logs
      const tokenIdHex = receipt.logs[0].topics[3];
      const tokenId = parseInt(tokenIdHex, 16);

      return {
        receipt,
        tokenId,
      };
    } catch (error) {
      throw new Error(`Failed to mint ID Card: ${error.message}`);
    }
  }

  /**
   * Link document to ID card
   * @param {Number} tokenId - Token ID
   * @param {String} documentId - Document ID
   * @param {String} ownerAddress - Owner's address
   */
  async linkDocument(tokenId, documentId, ownerAddress) {
    try {
      if (!this.contract) {
        throw new Error("IDCard contract not initialized");
      }

      // Create transaction data
      const data = this.contract.methods
        .linkDocument(tokenId, documentId)
        .encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        ownerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: ownerAddress,
        to: config.blockchain.contracts.idCard.address,
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
      throw new Error(`Failed to link document: ${error.message}`);
    }
  }

  /**
   * Get token ID by DID
   * @param {String} did - DID to lookup
   */
  async getTokenByDID(did) {
    try {
      if (!this.contract) {
        throw new Error("IDCard contract not initialized");
      }

      const tokenId = await this.contract.methods.getTokenByDID(did).call();
      return tokenId;
    } catch (error) {
      throw new Error(`Failed to get token ID: ${error.message}`);
    }
  }

  /**
   * Get token URI
   * @param {Number} tokenId - Token ID
   */
  async getTokenURI(tokenId) {
    try {
      if (!this.contract) {
        throw new Error("IDCard contract not initialized");
      }

      const uri = await this.contract.methods.tokenURI(tokenId).call();
      return uri;
    } catch (error) {
      throw new Error(`Failed to get token URI: ${error.message}`);
    }
  }

  /**
   * Get linked documents for token
   * @param {Number} tokenId - Token ID
   */
  async getLinkedDocuments(tokenId) {
    try {
      if (!this.contract) {
        throw new Error("IDCard contract not initialized");
      }

      const documents = await this.contract.methods
        .getLinkedDocuments(tokenId)
        .call();
      return documents;
    } catch (error) {
      throw new Error(`Failed to get linked documents: ${error.message}`);
    }
  }
}

module.exports = new NFTService();
