import { create } from 'zustand';

export interface UserProfile {
  id: string;
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  isVerifiedAgent: boolean;
  role: 'BUYER' | 'OWNER' | 'AGENT' | 'ADMIN';
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('zd_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('zd_token'),
  setAuth: (token, user) => {
    localStorage.setItem('zd_token', token);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('zd_token');
    set({ token: null, user: null, isAuthenticated: false });
  }
}));
