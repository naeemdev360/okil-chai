'use client';

import { QueryProvider, ApiClientProvider } from '@repo/hooks';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { api } from '../../lib/api/client';
import { AuthInitializer } from '../../components/auth/AuthInitializer';

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ApiClientProvider client={api}>
        <AuthInitializer />
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ApiClientProvider>
    </QueryProvider>
  );
}
