const Web3 = require("web3");
const config = require("../../config");
const Identity = require("../build/contracts/Identity.json");

class IdentityService {
  constructor() {
    this.provider = new Web3.providers.HttpProvider(config.blockchain.provider);
    this.web3 = new Web3(this.provider);

    // Initialize contract if address is available
    if (config.blockchain.contracts.identity.address) {
      this.contract = new this.web3.eth.Contract(
        Identity.abi,
        config.blockchain.contracts.identity.address
      );
    }
  }

  /**
   * Create a new identity on the blockchain
   * @param {String} did - Decentralized Identifier
   * @param {String} metadataHash - IPFS hash of identity metadata
   * @param {String} ownerAddress - Ethereum address of identity owner
   */
  async createIdentity(did, metadataHash, ownerAddress) {
    try {
      if (!this.contract) {
        throw new Error("Identity contract not initialized");
      }

      // Create transaction data
      const data = this.contract.methods
        .createIdentity(did, metadataHash)
        .encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        ownerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: ownerAddress,
        to: config.blockchain.contracts.identity.address,
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
      throw new Error(`Failed to create identity: ${error.message}`);
    }
  }

  /**
   * Update identity metadata
   * @param {String} metadataHash - New IPFS hash of identity metadata
   * @param {String} ownerAddress - Ethereum address of identity owner
   */
  async updateIdentity(metadataHash, ownerAddress) {
    try {
      if (!this.contract) {
        throw new Error("Identity contract not initialized");
      }

      // Create transaction data
      const data = this.contract.methods
        .updateIdentity(metadataHash)
        .encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        ownerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: ownerAddress,
        to: config.blockchain.contracts.identity.address,
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
      throw new Error(`Failed to update identity: ${error.message}`);
    }
  }

  /**
   * Deactivate identity
   * @param {String} ownerAddress - Ethereum address of identity owner
   */
  async deactivateIdentity(ownerAddress) {
    try {
      if (!this.contract) {
        throw new Error("Identity contract not initialized");
      }

      // Create transaction data
      const data = this.contract.methods.deactivateIdentity().encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        ownerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: ownerAddress,
        to: config.blockchain.contracts.identity.address,
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
      throw new Error(`Failed to deactivate identity: ${error.message}`);
    }
  }

  /**
   * Reactivate identity
   * @param {String} ownerAddress - Ethereum address of identity owner
   */
  async reactivateIdentity(ownerAddress) {
    try {
      if (!this.contract) {
        throw new Error("Identity contract not initialized");
      }

      // Create transaction data
      const data = this.contract.methods.reactivateIdentity().encodeABI();

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(
        ownerAddress,
        "latest"
      );

      // Create transaction object
      const tx = {
        from: ownerAddress,
        to: config.blockchain.contracts.identity.address,
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
      throw new Error(`Failed to reactivate identity: ${error.message}`);
    }
  }

  /**
   * Get identity by DID
   * @param {String} did - Decentralized Identifier
   */
  async getIdentityByDid(did) {
    try {
      if (!this.contract) {
        throw new Error("Identity contract not initialized");
      }

      // Check if DID exists
      const exists = await this.contract.methods.didExists(did).call();
      if (!exists) {
        return null;
      }

      // Get identity data
      const identityData = await this.contract.methods
        .getIdentityByDid(did)
        .call();

      return {
        did: identityData.did,
        owner: identityData.owner,
        createdAt: new Date(identityData.createdAt * 1000),
        active: identityData.active,
        metadataHash: identityData.metadataHash,
      };
    } catch (error) {
      throw new Error(`Failed to get identity: ${error.message}`);
    }
  }

  /**
   * Get identity by address
   * @param {String} address - Ethereum address
   */
  async getIdentity(address) {
    try {
      if (!this.contract) {
        throw new Error("Identity contract not initialized");
      }

      // Get identity data
      const identityData = await this.contract.methods
        .getIdentity(address)
        .call();

      // If DID is empty, no identity exists for this address
      if (!identityData.did) {
        return null;
      }

      return {
        did: identityData.did,
        owner: identityData.owner,
        createdAt: new Date(identityData.createdAt * 1000),
        active: identityData.active,
        metadataHash: identityData.metadataHash,
      };
    } catch (error) {
      throw new Error(`Failed to get identity: ${error.message}`);
    }
  }
}

module.exports = new IdentityService();
