'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../lib/store/auth.store';

export function AuthInitializer(): null {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => { void initialize(); }, [initialize]);
  return null;
}
