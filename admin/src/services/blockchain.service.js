import apiClient from './api.service';

export const blockchainService = {
  /**
   * Get blockchain network information
   */
  getNetworkInfo: async () => {
    try {
      const response = await apiClient.get('/blockchain/info');
      return response.data;
    } catch (error) {
      console.error("Error fetching blockchain info:", error);
      throw error.response?.data || { message: 'Failed to connect to blockchain' };
    }
  },

  /**
   * Get contract addresses
   */
  getContractAddresses: async () => {
    try {
      const response = await apiClient.get('/blockchain/contracts');
      return response.data;
    } catch (error) {
      console.error("Error fetching contract addresses:", error);
      throw error.response?.data || { message: 'Failed to get contract addresses' };
    }
  },

  /**
   * Get student count from identity contract
   */
  getStudentCount: async () => {
    try {
      const response = await apiClient.get('/blockchain/contracts/identity/count');
      return response.data;
    } catch (error) {
      console.error("Error fetching student count:", error);
      throw error.response?.data || { message: 'Failed to get student count' };
    }
  },

  /**
   * Verify student records
   */
  verifyStudentRecords: async () => {
    try {
      const response = await apiClient.get('/blockchain/contracts/identity/verify');
      return response.data;
    } catch (error) {
      console.error("Error verifying student records:", error);
      throw error.response?.data || { message: 'Failed to verify student records' };
    }
  },

  /**
   * Check student card validity
   */
  checkCardValidity: async (studentId) => {
    try {
      const response = await apiClient.get(`/blockchain/contracts/card/validate?studentId=${encodeURIComponent(studentId)}`);
      return response.data;
    } catch (error) {
      console.error("Error checking card validity:", error);
      throw error.response?.data || { message: 'Failed to check card validity' };
    }
  },

  /**
   * Create a new blockchain wallet
   */
  createWallet: async () => {
    try {
      const response = await apiClient.post('/blockchain/wallet/create');
      return response.data;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error.response?.data || { message: 'Failed to create wallet' };
    }
  },

  /**
   * Get wallet balance for address
   */
  getWalletBalance: async (address) => {
    try {
      const response = await apiClient.get(`/blockchain/wallet/balance/${address}`);
      return response.data;
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      throw error.response?.data || { message: `Failed to get wallet balance for ${address}` };
    }
  }
};

export default blockchainService;