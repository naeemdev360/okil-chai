import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Lock, RefreshCw, HeadphonesIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TRUST_KEYS = ['verified', 'secure', 'refund', 'support'] as const;

const TRUST_ICONS = {
  verified: ShieldCheck,
  secure:   Lock,
  refund:   RefreshCw,
  support:  HeadphonesIcon,
} satisfies Record<string, LucideIcon>;

export async function TrustSafetySection() {
  const t = await getTranslations('home.trust');

  return (
    <section className="bg-white py-20 px-6 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
            {t('sectionLabel')}
          </span>
          <h2 className="font-heading text-[36px] font-semibold text-navy">
            {t('title')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_KEYS.map((key) => {
            const Icon = TRUST_ICONS[key];
            return (
              <div key={key} className="flex flex-col gap-4">
                <div className="size-12 rounded-md bg-gold/10 border border-gold/24 flex items-center justify-center">
                  <Icon className="size-5 text-gold" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-[17px] font-semibold text-navy mb-1.5">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {t(`items.${key}.body`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
