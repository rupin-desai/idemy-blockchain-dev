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
      throw error.response?.data || { message: 'Failed to fetch blockchain status' };
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
      throw error.response?.data || { message: `Failed to get wallet balance for ${address}` };
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
      throw error.response?.data || { message: 'Failed to create wallet' };
    }
  }
};

export default blockchainService;