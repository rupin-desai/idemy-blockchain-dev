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

// Function to update authorization header
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('idemy_auth_token');
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
    
    // Check if error contains Firestore permission denied message
    const isFirestorePermissionError = 
      error.response?.data?.message?.includes('PERMISSION_DENIED: Cloud Firestore API') ||
      error.message?.includes('PERMISSION_DENIED: Cloud Firestore API');
    
    // If Firestore permission error, don't redirect to login
    if (isFirestorePermissionError) {
      return Promise.reject({
        ...error,
        isFirestoreError: true,
        message: 'Firestore access denied. The database may not be properly initialized.'
      });
    }
    
    // If the error is 401 and not already retrying and not a Firestore error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login page and clear auth data
      localStorage.removeItem('idemy_auth_token');
      localStorage.removeItem('idemy_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
