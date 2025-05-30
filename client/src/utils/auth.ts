import type { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REMEMBER_ME_KEY = 'remember_me';

export const authStorage = {
  // Token management
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string, rememberMe: boolean = false): void => {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      // Clear any existing token in localStorage when rememberMe is false
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  },

  // User data management
  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: User, rememberMe: boolean = false): void => {
    const userData = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(USER_KEY, userData);
    } else {
      sessionStorage.setItem(USER_KEY, userData);
      localStorage.removeItem(USER_KEY);
    }
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  // Remember me functionality
  shouldRememberMe: (): boolean => {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  },

  // Clear all auth data
  clear: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  }
};
