import { getLocale } from 'next-intl/server';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';

interface MarketingLayoutProps {
  readonly children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
