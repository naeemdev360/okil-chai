'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const ApiClientContext = createContext(null);
export function ApiClientProvider({ client, children }) {
    return (_jsx(ApiClientContext.Provider, { value: client, children: children }));
}
export function useApiClient() {
    const client = useContext(ApiClientContext);
    if (client === null) {
        throw new Error('useApiClient must be used within <ApiClientProvider>');
    }
    return client;
}
