import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-5xl font-bold text-white mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </div>
    </main>
  );
}
