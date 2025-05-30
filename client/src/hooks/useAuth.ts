import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import type { AuthContextType } from '../context/AuthContext.types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
