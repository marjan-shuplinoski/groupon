import type { User, LoginResponse } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}
