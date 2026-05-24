'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[AppError]', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-cream items-center justify-center px-4 py-24">
      <div className="text-center max-w-md">
        <span
          aria-hidden="true"
          className="block font-heading font-bold leading-none text-error select-none"
          style={{ fontSize: 'clamp(5rem, 18vw, 8rem)', opacity: 0.08 }}
        >
          ⚠
        </span>

        <h1 className="font-heading text-3xl font-semibold text-navy mt-2">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          You can try again or return to the homepage.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs font-mono text-gray-400">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-navy text-cream px-7 py-3 rounded-lg font-medium hover:bg-navy-mid transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-navy/20 text-navy px-7 py-3 rounded-lg font-medium hover:bg-navy/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
