import axios from 'axios';

// Use Vite's environment variable format
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Retrieve token from localStorage directly instead of importing authService
const getToken = () => localStorage.getItem('idemy_auth_token');

// Initialize the Authorization header if token exists
const token = getToken();
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get the most recent token on every request
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If token validation fails, redirect to login
      localStorage.removeItem('idemy_auth_token');
      localStorage.removeItem('idemy_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Function to update authorization header
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;
