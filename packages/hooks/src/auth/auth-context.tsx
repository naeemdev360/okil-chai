'use client';

import type { ApiClient, UserProfile } from '@repo/api-client';
import { getPortalKind, type PortalKind, type Role } from '@repo/shared';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type AuthStatus = 'loading' | 'authed' | 'guest';

export interface PortalAuthValue {
  readonly status: AuthStatus;
  readonly user: UserProfile | null;
  /** Re-run the silent refresh + profile load (e.g. after a profile update). */
  readonly refresh: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthValue | null>(null);

interface AuthProviderProps {
  readonly client: ApiClient;
  readonly children: ReactNode;
}

/** Restores the session from the httpOnly refresh cookie on mount and exposes auth state to the portal. */
export function AuthProvider({ client, children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refresh = useCallback(async () => {
    const profile = await client.bootstrap();
    setUser(profile);
    setStatus(profile !== null ? 'authed' : 'guest');
  }, [client]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <PortalAuthContext.Provider value={{ status, user, refresh }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth(): PortalAuthValue {
  const value = useContext(PortalAuthContext);
  if (value === null) {
    throw new Error('usePortalAuth must be used within <AuthProvider>');
  }
  return value;
}

export type GuardState = 'loading' | 'authorized';

export interface PortalGuardConfig {
  /** The portal this app serves; users whose roles map elsewhere are redirected away. */
  readonly portalKind: PortalKind;
  /** Full landing sign-in URL (with returnUrl) to send unauthenticated users to. */
  readonly signInUrl: string;
  /** Resolve the correct portal URL for a user whose roles don't match this portal. */
  readonly resolvePortalUrl: (roles: readonly Role[]) => string;
}

/**
 * Gate a portal's routes: shows `loading` until the session resolves, redirects guests to
 * sign-in and role-mismatched users to their own portal, and returns `authorized` otherwise.
 */
export function usePortalGuard({ portalKind, signInUrl, resolvePortalUrl }: PortalGuardConfig): GuardState {
  const { status, user } = usePortalAuth();
  const matchesPortal = user !== null && getPortalKind(user.roles) === portalKind;

  useEffect(() => {
    if (status === 'guest') {
      window.location.href = signInUrl;
    } else if (status === 'authed' && user !== null && !matchesPortal) {
      window.location.href = resolvePortalUrl(user.roles);
    }
  }, [status, user, matchesPortal, signInUrl, resolvePortalUrl]);

  return status === 'authed' && matchesPortal ? 'authorized' : 'loading';
}
