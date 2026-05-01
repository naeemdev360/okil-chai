import { getTranslations } from 'next-intl/server';

const STAT_KEYS = ['lawyers', 'areas', 'satisfaction', 'bookingTime'] as const;

export async function StatsBar() {
  const t = await getTranslations('home.stats');

  return (
    <div className="bg-cream border-b border-gray-100 py-6 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center gap-x-16 gap-y-4">
        {STAT_KEYS.map((key) => (
          <div key={key} className="text-center">
            <div className="font-heading text-[28px] font-bold text-navy leading-none">
              {t(`${key}.value`)}
            </div>
            <div className="font-sans text-xs text-gray-600 mt-1">
              {t(`${key}.label`)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
