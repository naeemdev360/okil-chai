import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Locale } from '@repo/i18n';
import { routing } from '../../i18n/routing';
import { brand } from '../../lib/brand';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: `%s | ${brand.name}`,
    default: `${brand.name} — ${brand.tagline}`,
  },
  description:
    'Legal help as easy as booking a doctor. Find trusted, verified lawyers in Bangladesh.',
};

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
