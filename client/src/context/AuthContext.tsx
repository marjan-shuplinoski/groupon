import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/authService';
import { authStorage } from '../utils/auth';
import { api } from '../services/api';
import type { User, LoginResponse } from '../types/auth';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect based on user role
  const redirectBasedOnRole = useCallback((user: User) => {
    const currentPath = window.location.pathname;
    // Only redirect if on login/register/root
    if (["/login", "/register", "/"].includes(currentPath)) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'merchant') {
        navigate('/merchant/dashboard');
      } else {
        navigate('/deals');
      }
    }
    // Otherwise, let user stay on their chosen route
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await logoutService();
      setUser(null);
      authStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear storage even if the logout API call fails
      authStorage.clear();
      navigate('/login');
      throw error;
    }
  }, [navigate]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authStorage.getToken();
        if (token) {
          // Set the token in the default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            // Try to fetch the current user data
            const userData = await getCurrentUser();
            setUser(userData);
            
            // Only redirect if we're not already on a protected route
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/admin') && 
                !currentPath.startsWith('/merchant') &&
                !currentPath.startsWith('/deals')) {
              redirectBasedOnRole(userData);
            }
          } catch (error) {
            console.error('Failed to fetch current user:', error);
            // If we can't fetch user data, log out
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [redirectBasedOnRole, logout]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
    console.log('AuthContext: Starting login process');
    try {
      console.log('AuthContext: Calling loginService with email:', email);
      const response = await loginService(email, password);
      console.log('AuthContext: Login service response:', response);
      
      if (response.user) {
        console.log('AuthContext: Login successful, setting user and token');
        setUser(response.user);
        authStorage.setToken(response.token || '', rememberMe);
        authStorage.setUser(response.user, rememberMe);
        console.log('AuthContext: Token and user data stored, redirecting based on role:', response.user.role);
        // Only redirect on successful login
        redirectBasedOnRole(response.user);
        return response;
      } else {
        console.error('AuthContext: No user in response:', response);
        throw new Error('No user data received from server');
      }
    } catch (error) {
      console.error('AuthContext: Login failed with error:', error);
      // Clear any partial auth data
      authStorage.clear();
      setUser(null);
      // Re-throw the error to be handled by the Login component
      throw error;
    }
  }, [redirectBasedOnRole]);



  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    logout
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
