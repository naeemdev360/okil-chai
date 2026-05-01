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
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <ApiClientProvider client={api}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </ApiClientProvider>
    </QueryProvider>
  </StrictMode>,
);
