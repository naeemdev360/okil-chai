'use client';

import { QueryProvider, ApiClientProvider } from '@okil-chai/hooks';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { api } from '../../lib/api/client';

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ApiClientProvider client={api}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ApiClientProvider>
    </QueryProvider>
  );
}
