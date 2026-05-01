'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from './create-query-client';
export function QueryProvider({ children }) {
    // useState(fn) initialiser runs once — safe for both SSR and concurrent mode.
    const [client] = useState(createQueryClient);
    return _jsx(QueryClientProvider, { client: client, children: children });
}
