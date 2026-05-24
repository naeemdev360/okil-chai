import Link from 'next/link';

/**
 * Root-level 404 fallback.
 * Rendered when notFound() is called from [locale]/layout.tsx (e.g. invalid locale).
 * Runs outside the locale layout — no i18n providers, no custom fonts.
 */
export default function RootNotFound() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        background: '#FAF8F4',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '8rem',
          fontWeight: 700,
          lineHeight: 1,
          color: '#0F1F3D',
          opacity: 0.06,
          margin: 0,
          userSelect: 'none',
        }}
      >
        404
      </p>

      <h1
        style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#0F1F3D',
          marginTop: '-1rem',
          marginBottom: '1rem',
        }}
      >
        Page Not Found
      </h1>

      <p style={{ color: '#5C5A55', maxWidth: '22rem', lineHeight: 1.6 }}>
        The page you requested doesn't exist. Please check the URL or return to the homepage.
      </p>

      <Link
        href="/en"
        style={{
          marginTop: '2rem',
          display: 'inline-block',
          background: '#0F1F3D',
          color: '#FAF8F4',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
