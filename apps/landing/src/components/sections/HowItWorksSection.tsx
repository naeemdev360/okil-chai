import { brand } from '@/lib/brand';
import { CalendarCheck, Search, UserCheck, type LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
const STEP_ICONS = {
  search: Search,
  book:   CalendarCheck,
  help:   UserCheck,
} satisfies Record<string, LucideIcon>;

const STEP_KEYS = ['search', 'book', 'help'] as const;

export async function HowItWorksSection() {
  const t = await getTranslations('home.howItWorks');

  return (
    <section id="how-it-works" className="bg-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
            {t('sectionLabel')}
          </span>
          <h2 className="font-heading text-[36px] font-semibold text-navy">
            {t('title',{
              appName: brand.name,
            })}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEP_KEYS.map((key) => {
            const Icon = STEP_ICONS[key];
            return (
              <div
                key={key}
                className="bg-cream border border-gray-100 border-t-[3px] border-t-gold rounded-lg p-7"
              >
                <span className="font-sans text-xs font-semibold text-gold tracking-[0.08em] uppercase mb-2 block">
                  {t(`steps.${key}.number`)}
                </span>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="size-5 text-gold shrink-0" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="font-heading text-xl font-semibold text-navy">
                    {t(`steps.${key}.title`)}
                  </h3>
                </div>
                <p className="font-sans text-sm text-gray-600 leading-relaxed">
                  {t(`steps.${key}.body`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
