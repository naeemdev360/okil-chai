import { create } from 'zustand';
import type { AuthTokens, UserProfile } from '@okil-chai/api-client';
import { api } from '../api/client';
import { clearTokens, getAccessToken, setTokens } from '../auth/auth-storage';

interface AuthState {
  readonly user: UserProfile | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
}

interface AuthActions {
  readonly initialize: () => Promise<void>;
  readonly login: (tokens: AuthTokens) => Promise<void>;
  readonly logout: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    if (!getAccessToken()) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await api.auth.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (tokens: AuthTokens) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    const user = await api.auth.getMe();
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } finally {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },
}));
