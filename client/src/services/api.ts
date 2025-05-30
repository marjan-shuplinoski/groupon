import axios from 'axios';
import { authStorage } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with requests
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config) return Promise.reject(error);
    
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        if (response.data?.token) {
          const token = response.data.token;
          
          // Store the new token
          authStorage.setToken(token);
          
          // Update the Authorization header
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, log the user out
        authStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject with the error
    return Promise.reject(error);
  }
);

export { api };
