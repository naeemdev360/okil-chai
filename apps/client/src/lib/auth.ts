const ACCESS_TOKEN_KEY = 'accessToken' as const;

export function hasAccessToken(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
}

const LANDING_URL = (import.meta.env.VITE_LANDING_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const authRoutes = {
  signIn: `${LANDING_URL}/auth/signin?portal=client`,
  signUp: `${LANDING_URL}/auth/signup?portal=client`,
  home:   `${LANDING_URL}/`,
} as const;
