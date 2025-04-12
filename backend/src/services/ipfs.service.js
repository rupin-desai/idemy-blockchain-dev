const pinataSDK = require("@pinata/sdk");
const axios = require("axios");
const FormData = require("form-data");
const config = require("../config");

class IPFSService {
  constructor() {
    this.pinata = pinataSDK(
      config.ipfs.pinata.apiKey,
      config.ipfs.pinata.secretApiKey
    );
    this.gateway = config.ipfs.gateway;
  }

  /**
   * Test the IPFS connection
   */
  async testConnection() {
    try {
      const result = await this.pinata.testAuthentication();
      return result.authenticated;
    } catch (error) {
      console.error("IPFS connection test failed:", error);
      throw new Error(`IPFS connection test failed: ${error.message}`);
    }
  }

  /**
   * Upload a file to IPFS
   * @param {Buffer} fileBuffer - The file buffer
   * @param {String} fileName - Name of the file (optional)
   */
  async uploadFile(fileBuffer, fileName = "document") {
    try {
      const formData = new FormData();

      formData.append("file", fileBuffer, {
        filename: fileName,
      });

      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          uploadDate: new Date().toISOString(),
        },
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append("pinataOptions", options);

      const response = await this.pinata.pinFileToIPFS(formData);

      return response.IpfsHash;
    } catch (error) {
      console.error("IPFS file upload failed:", error);
      throw new Error(`IPFS file upload failed: ${error.message}`);
    }
  }

  /**
   * Upload JSON data to IPFS
   * @param {Object} jsonData - JSON data to upload
   * @param {String} name - Optional name for the content
   */
  async uploadJSON(jsonData, name = "metadata") {
    try {
      const response = await this.pinata.pinJSONToIPFS(jsonData, {
        pinataMetadata: {
          name: name,
          keyvalues: {
            uploadDate: new Date().toISOString(),
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      });

      return response.IpfsHash;
    } catch (error) {
      console.error("IPFS JSON upload failed:", error);
      throw new Error(`IPFS JSON upload failed: ${error.message}`);
    }
  }

  /**
   * Get data from IPFS by hash
   * @param {String} ipfsHash - IPFS hash to retrieve
   */
  async getJSON(ipfsHash) {
    try {
      const url = `${this.gateway}${ipfsHash}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("IPFS data retrieval failed:", error);
      throw new Error(`IPFS data retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get file content from IPFS by hash
   * @param {String} ipfsHash - IPFS hash to retrieve
   */
  async getFile(ipfsHash) {
    try {
      const url = `${this.gateway}${ipfsHash}`;
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });
      return response.data;
    } catch (error) {
      console.error("IPFS file retrieval failed:", error);
      throw new Error(`IPFS file retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get the public URL for an IPFS hash
   * @param {String} ipfsHash - IPFS hash
   */
  getPublicUrl(ipfsHash) {
    return `${this.gateway}${ipfsHash}`;
  }

  /**
   * Unpin content from IPFS
   * @param {String} ipfsHash - IPFS hash to unpin
   */
  async unpinContent(ipfsHash) {
    try {
      await this.pinata.unpin(ipfsHash);
      return true;
    } catch (error) {
      console.error("IPFS unpin failed:", error);
      throw new Error(`IPFS unpin failed: ${error.message}`);
    }
  }
}

module.exports = new IPFSService();
