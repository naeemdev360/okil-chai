import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './lib/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryProvider, ApiClientProvider } from '@okil-chai/hooks';
import './styles/globals.css';
import { App } from './App';
import { api } from './lib/api/client';
const rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error('Root element not found');
createRoot(rootElement).render(_jsx(StrictMode, { children: _jsx(QueryProvider, { children: _jsxs(ApiClientProvider, { client: api, children: [_jsx(BrowserRouter, { children: _jsx(App, {}) }), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }) }) }));
