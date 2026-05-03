import { getTranslations, getLocale } from 'next-intl/server';
import Link                            from 'next/link';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button, SurfaceCard }         from '@okil-chai/ui';

const FEATURE_KEYS = ['feature0', 'feature1', 'feature2'] as const;

function MockMatcherPreview() {
  const MOCK_CARDS = [
    { initials: 'TK', name: 'Thomas Kim',  spec: 'Real Estate',   score: 95, isBest: true  },
    { initials: 'AP', name: 'Amara Patel', spec: 'Family Law',    score: 89, isBest: false },
    { initials: 'ML', name: 'Marcus Liu',  spec: 'Corporate Law', score: 83, isBest: false },
  ] as const;

  return (
    <SurfaceCard
      elevation="lg"
      className="relative overflow-hidden"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-10 -right-10 size-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--color-gold) 14%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Mock textarea */}
      <div className="rounded-lg border border-gray-200 bg-cream p-4 mb-5 relative">
        <p className="font-sans text-sm text-gray-500 leading-relaxed">
          My landlord is trying to evict me without proper notice. The lease has 4 months left…
        </p>
        <span className="absolute bottom-3 right-3 font-sans text-[10px] text-gray-400">
          Encrypted · Confidential
        </span>
      </div>

      {/* Mock result cards */}
      {MOCK_CARDS.map((card) => (
        <div
          key={card.initials}
          className={`flex items-center gap-3 p-3.5 rounded-xl mb-2.5 border ${
            card.isBest ? 'border-gold/40 bg-gold-pale' : 'border-gray-100 bg-white'
          }`}
        >
          <div className="relative shrink-0">
            <div className="size-10 rounded-full bg-navy flex items-center justify-center">
              <span className="font-heading text-sm font-semibold text-white">{card.initials}</span>
            </div>
            <span
              className={`absolute -top-1 -right-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full border border-white ${
                card.isBest ? 'bg-gold text-navy' : 'bg-navy text-white'
              }`}
            >
              {card.score}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-sm font-semibold text-navy leading-tight">{card.name}</p>
            <p className="font-sans text-[11px] text-gold uppercase tracking-[0.05em]">{card.spec}</p>
          </div>
        </div>
      ))}
    </SurfaceCard>
  );
}

export async function AiMatcherSection() {
  const [t, locale] = await Promise.all([
    getTranslations('aiMatcher.teaser'),
    getLocale(),
  ]);

  return (
    <section className="bg-white py-20 px-6 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div>
            <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
              {t('sectionLabel')}
            </span>
            <h2 className="font-heading text-[36px] font-semibold text-navy leading-tight mb-5">
              {t('title')}{' '}
              <span
                style={{
                  background: 'linear-gradient(138deg, var(--color-gold-light) 0%, var(--color-gold) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('titleHighlight')}
              </span>
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed mb-8 max-w-[480px]">
              {t('subtitle')}
            </p>

            <ul className="flex flex-col gap-3 mb-10" role="list">
              {FEATURE_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-3 font-sans text-sm text-gray-700">
                  <span className="size-5 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-gold" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>

            <Button variant="gold" size="lg" asChild className="gap-2">
              <Link href={`/${locale}/ai-match`}>
                <Sparkles className="size-4" aria-hidden="true" />
                {t('cta')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Right — decorative mock */}
          <div className="hidden lg:block">
            <MockMatcherPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
