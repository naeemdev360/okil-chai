'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ApiClient } from '@okil-chai/api-client';

const ApiClientContext = createContext<ApiClient | null>(null);

interface ApiClientProviderProps {
  readonly client: ApiClient;
  readonly children: ReactNode;
}

export function ApiClientProvider({ client, children }: ApiClientProviderProps) {
  return (
    <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>
  );
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext);
  if (client === null) {
    throw new Error('useApiClient must be used within <ApiClientProvider>');
  }
  return client;
}
