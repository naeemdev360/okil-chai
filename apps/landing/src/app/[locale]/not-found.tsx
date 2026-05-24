import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <span
            aria-hidden="true"
            className="block font-heading font-bold leading-none text-navy select-none"
            style={{ fontSize: 'clamp(6rem, 20vw, 10rem)', opacity: 0.06 }}
          >
            404
          </span>

          <h1 className="font-heading text-3xl font-semibold text-navy -mt-4">
            Page Not Found
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center bg-navy text-cream px-7 py-3 rounded-lg font-medium hover:bg-navy-mid transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href={`/${locale}/search`}
              className="inline-flex items-center justify-center border border-navy/20 text-navy px-7 py-3 rounded-lg font-medium hover:bg-navy/5 transition-colors"
            >
              Browse Lawyers
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
