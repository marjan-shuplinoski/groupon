export type UserRole = 'user' | 'merchant' | 'admin';

export interface BaseUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserRegisterData extends Omit<BaseUserData, 'role'> {
  role: 'user';
}

export interface MerchantRegisterData extends Omit<BaseUserData, 'role'> {
  role: 'merchant';
  businessName: string;
  businessAddress: string;
  phone: string;
  businessDescription?: string;
  website?: string;
}

// Union type that represents either user or merchant registration data
export type RegisterFormData = UserRegisterData | MerchantRegisterData;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Merchant specific fields (optional)
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  businessDescription?: string;
  website?: string;
  // Add any other user fields as needed
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  expiresIn?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
