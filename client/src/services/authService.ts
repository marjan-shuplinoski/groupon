import type { 
  UserRegisterData, 
  MerchantRegisterData, 
  User, 
  UserRole, 
  AuthResponse, 
  LoginResponse 
} from '../types/auth';
import { authStorage } from '../utils/auth';
import { api } from './api'; // Import the centralized api instance

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      error?: string;
      statusCode?: number;
      [key: string]: unknown;
    };
    status?: number;
    headers?: Record<string, unknown>;
  };
  config?: {
    url?: string;
    method?: string;
    headers?: Record<string, unknown>;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Register a new user
export const registerUser = async (userData: UserRegisterData): Promise<AuthResponse> => {
  const requestData = {
    ...userData,
    repeatPassword: userData.password // Add repeatPassword to match server expectation
  };
  const response = await api.post<AuthResponse>('/auth/register', requestData);
  return response.data;
};

// Register a new merchant
export const registerMerchant = async (merchantData: MerchantRegisterData): Promise<AuthResponse> => {
  const requestData = {
    ...merchantData,
    repeatPassword: merchantData.password // Add repeatPassword to match server expectation
  };
  const response = await api.post<AuthResponse>('/merchant/register', requestData);
  return response.data;
};

// Get current user data using the token
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<Omit<User, 'password'>>('/auth/me');
    return response.data as User;
  } catch (error: unknown) {
    console.error('Error fetching current user:', error);
    // Clear auth data if the request fails with 401 (Unauthorized)
    const axiosError = error as { response?: { status: number } };
    if (axiosError?.response?.status === 401) {
      authStorage.clear();
    }
    throw error;
  }
};

// Login user
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Email:', email);
    console.log('API Base URL:', API_URL);
    console.log('Full Login URL:', `${API_URL}/auth/login`);
    
    // 1. First, authenticate and get the token
    const loginResponse = await api.post<{ 
      message: string; 
      token: string;
    }>('/auth/login', { email, password }, {
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors
    });
    
    console.log('Login response:', loginResponse.data);
    
    // Handle 4xx errors from the API
    if (loginResponse.status >= 400) {
      const error = new Error(loginResponse.data?.message || 'Login failed') as any;
      error.response = loginResponse;
      throw error;
    }
    
    if (!loginResponse.data?.token) {
      throw new Error('No token received from server');
    }
    
    const { token } = loginResponse.data;
    
    // 2. Store the token in auth storage
    authStorage.setToken(token);
    
    // 3. Fetch the current user data
    const user = await getCurrentUser();
    
    // Ensure the role is one of the valid UserRole types
    const validRole = (role: string): UserRole => {
      return ['user', 'merchant', 'admin'].includes(role) 
        ? role as UserRole 
        : 'user';
    };
    
    const userWithValidRole: User = {
      ...user,
      role: validRole(user.role),
      name: user.name || email.split('@')[0],
      isEmailVerified: user.isEmailVerified || false,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    };
    
    // Store user data in storage
    authStorage.setUser(userWithValidRole);
    
    return { user: userWithValidRole, token };
  } catch (error: any) {
    console.error('Login failed:', error);
    authStorage.clear();
    
    // Preserve the original error response if it exists
    if (error.response) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 
                         apiError.response?.data?.error || 
                         apiError.message || 
                         'Login failed. Please check your credentials.';
      const customError = new Error(errorMessage) as any;
      customError.response = apiError.response;
      throw customError;
    }
    
    // For network errors or other issues, throw a more specific error
    throw new Error(error.message || 'Login failed. Please check your network connection.');
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
