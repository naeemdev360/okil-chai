import { create } from 'zustand';
import type { AuthTokens, UserProfile } from '@repo/api-client';
import { api } from '../api/client';

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

  // Silently restore the session from the refresh cookie (no token in localStorage).
  initialize: async () => {
    const user = await api.bootstrap();
    set({ user, isAuthenticated: user !== null, isLoading: false });
  },

  login: async ({ accessToken }: AuthTokens) => {
    api.setAccessToken(accessToken);
    const user = await api.auth.getMe();
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } finally {
      api.setAccessToken(null);
      set({ user: null, isAuthenticated: false });
    }
  },
}));
