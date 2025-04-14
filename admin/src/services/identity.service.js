import apiClient from "./api.service";

export const identityService = {
  // Create a new student identity
  createIdentity: async (identityData) => {
    try {
      const response = await apiClient.post("/identity", identityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create student identity" };
    }
  },

  // Get identity by DID
  getIdentity: async (did) => {
    try {
      const response = await apiClient.get(`/identity/${did}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch student identity" };
    }
  },

  // List all identities with filtering and pagination
  listIdentities: async (params = {}) => {
    try {
      const response = await apiClient.get("/identity", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to list student identities" };
    }
  },

  // Verify an identity
  verifyIdentity: async (did, status) => {
    try {
      const response = await apiClient.put(`/identity/${did}/verify`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to verify student identity" };
    }
  }
};

export default identityService;
