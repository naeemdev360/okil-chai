'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/**
 * Global error boundary — replaces the root layout on catastrophic failure.
 * Must render its own <html> and <body> tags.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#FAF8F4',
          padding: '2rem',
          textAlign: 'center',
          margin: 0,
        }}
      >
        <p
          style={{
            fontSize: '6rem',
            lineHeight: 1,
            margin: 0,
            userSelect: 'none',
            opacity: 0.08,
            color: '#B91C1C',
          }}
          aria-hidden="true"
        >
          ⚠
        </p>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#0F1F3D',
            marginTop: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          Application Error
        </h1>

        <p style={{ color: '#5C5A55', maxWidth: '22rem', lineHeight: 1.6, margin: 0 }}>
          A critical error occurred. Please try again. If the problem persists, contact support.
        </p>

        {error.digest && (
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: '#9B9890',
            }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '2rem',
            background: '#0F1F3D',
            color: '#FAF8F4',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontWeight: 500,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
