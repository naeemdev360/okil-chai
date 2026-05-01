import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import {
  Shield, Users, Briefcase, Globe, Home,
  UserCheck, Lightbulb, Receipt,
  type LucideIcon,
} from 'lucide-react';

const AREA_KEYS = [
  'criminal', 'family', 'corporate', 'immigration',
  'realestate', 'employment', 'ip', 'tax',
] as const;

const AREA_ICONS = {
  criminal:    Shield,
  family:      Users,
  corporate:   Briefcase,
  immigration: Globe,
  realestate:  Home,
  employment:  UserCheck,
  ip:          Lightbulb,
  tax:         Receipt,
} satisfies Record<string, LucideIcon>;

export async function PracticeAreasSection() {
  const [t, locale] = await Promise.all([
    getTranslations('home.practiceAreas'),
    getLocale(),
  ]);

  return (
    <section className="bg-cream py-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
            {t('sectionLabel')}
          </span>
          <h2 className="font-heading text-[36px] font-semibold text-navy mb-3">
            {t('title')}
          </h2>
          <p className="font-sans text-base text-gray-600 max-w-[560px] mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AREA_KEYS.map((key) => {
            const Icon = AREA_ICONS[key];
            return (
              <Link
                key={key}
                href={`/${locale}/search?area=${key}`}
                className="group bg-white border border-gray-100 rounded-lg p-7 flex flex-col gap-3 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-gold transition-all duration-200"
              >
                <div className="size-12 rounded-md bg-gold/12 flex items-center justify-center">
                  <Icon className="size-6 text-gold" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading text-[17px] font-semibold text-navy mb-1">
                    {t(`areas.${key}.name`)}
                  </p>
                  <p className="font-sans text-xs text-gray-600">
                    {t(`areas.${key}.desc`)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
