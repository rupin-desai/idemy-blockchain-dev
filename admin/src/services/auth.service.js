import apiClient, { setAuthToken } from "./api.service";

// Token storage key
const TOKEN_KEY = "idemy_auth_token";
const USER_KEY = "idemy_user";

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      // Try development login first, then fall back to regular login
      let response;
      try {
        response = await apiClient.post("/dev-auth/login", { email, password });
        // Handle the dev-auth response structure
        if (response.data && response.data.data && response.data.data.token) {
          // Store token and user data from the dev endpoint
          localStorage.setItem(TOKEN_KEY, response.data.data.token);
          localStorage.setItem(
            USER_KEY,
            JSON.stringify(response.data.data.user)
          );

          // Update the API client with the new token
          setAuthToken(response.data.data.token);

          return {
            success: response.data.success,
            message: response.data.message,
            token: response.data.data.token,
            user: response.data.data.user,
          };
        }
      } catch (devError) {
        console.log("Dev auth failed, trying regular auth...");
        // Fall back to regular auth endpoint if dev auth fails
        response = await apiClient.post("/auth/login", { email, password });

        if (response.data && response.data.token) {
          // Store token and user data
          localStorage.setItem(TOKEN_KEY, response.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

          // Update the API client with the new token
          setAuthToken(response.data.token);
        }
      }

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      throw new Error(errorMsg);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Remove the token from future API calls
    setAuthToken(null);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Validate token with backend
  validateToken: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error("No token found");
      }

      // Make a request to validate token
      await apiClient.get("/auth/validate-token");
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      throw new Error(errorMsg);
    }
  },
};

export default authService;
