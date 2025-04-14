import apiClient from './api.service';

export const contractService = {
  // Get contract addresses
  getContractAddresses: async () => {
    try {
      const response = await apiClient.get('/blockchain/contracts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch contract addresses' };
    }
  },
  
  // Verify student records in the identity contract
  verifyStudentRecords: async () => {
    try {
      const response = await apiClient.get('/blockchain/contracts/identity/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify student records' };
    }
  },
  
  // Check student card validity
  checkCardValidity: async (studentId) => {
    try {
      const response = await apiClient.get(`/blockchain/contracts/card/validate?studentId=${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check card validity' };
    }
  },
  
  // Get total student count from contract
  getStudentCount: async () => {
    try {
      const response = await apiClient.get('/blockchain/contracts/identity/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get student count' };
    }
  },

  // Create a new wallet
  createWallet: async () => {
    try {
      const response = await apiClient.post('/blockchain/wallet/create');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create wallet' };
    }
  },

  // Get wallet balance
  getWalletBalance: async (address) => {
    try {
      const response = await apiClient.get(`/blockchain/wallet/balance/${address}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: `Failed to get wallet balance for ${address}` };
    }
  }
};

export default contractService;