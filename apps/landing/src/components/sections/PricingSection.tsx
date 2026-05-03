'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';
import { Button, Badge, cn, SurfaceCard } from '@okil-chai/ui';

interface PlanConfig {
  readonly key: 'basic' | 'pro' | 'business';
  readonly price: number;
  readonly highlight: boolean;
  readonly featureCount: number;
  readonly unavailableFrom: number;
}

const PLANS: readonly PlanConfig[] = [
  { key: 'basic',    price: 0,  highlight: false, featureCount: 4, unavailableFrom: 4 },
  { key: 'pro',      price: 29, highlight: true,  featureCount: 5, unavailableFrom: 5 },
  { key: 'business', price: 99, highlight: false, featureCount: 7, unavailableFrom: 7 },
];

function PricingCard({ plan, annual }: { plan: PlanConfig; annual: boolean }) {
  const t = useTranslations('home.pricing');
  const locale = useLocale();

  const monthlyPrice = annual ? plan.price : Math.round(plan.price * 1.25);
  const isHighlight = plan.highlight;
  if (isHighlight) {
    return (
      <div
        className={cn(
          'relative rounded-2xl p-9 flex flex-col gap-7',
          'bg-navy shadow-[0_20px_60px_rgba(15,31,61,0.22)] scale-[1.03]',
        )}
      >
        <PricingCardInner
          plan={plan}
          isHighlight
          monthlyPrice={monthlyPrice}
        />
      </div>
    );
  }

  return (
    <SurfaceCard elevation="sm" padding="none" className="relative p-9 flex flex-col gap-7">
      <PricingCardInner
        plan={plan}
        isHighlight={false}
        monthlyPrice={monthlyPrice}
      />
    </SurfaceCard>
  );
}

interface PricingCardInnerProps {
  readonly plan: PlanConfig;
  readonly isHighlight: boolean;
  readonly monthlyPrice: number;
}

function PricingCardInner({
  plan, isHighlight, monthlyPrice,
}: PricingCardInnerProps) {
  const t = useTranslations('home.pricing');
  const locale = useLocale();

  return (
    <>
      {/* Badge */}
      {t.raw(`plans.${plan.key}.badge` as never) && (
        <Badge
          variant="topRated"
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs"
        >
          {t(`plans.${plan.key}.badge` as never)}
        </Badge>
      )}

      {/* Plan header */}
      <div>
        <p className="font-sans text-xs font-semibold tracking-[0.06em] uppercase text-gold mb-1.5">
          {t(`plans.${plan.key}.name`)}
        </p>
        <p className={cn('font-heading text-base font-medium mb-5', isHighlight ? 'text-white/75' : 'text-gray-600')}>
          {t(`plans.${plan.key}.tagline`)}
        </p>

        {/* Price */}
        <div className="flex items-end gap-1.5 mb-1">
          {plan.price === 0 ? (
            <span className={cn('font-heading text-5xl font-bold leading-none', isHighlight ? 'text-white' : 'text-navy')}>
              {t('plans.basic.billing')}
            </span>
          ) : (
            <>
              <span className={cn('font-sans text-xl font-medium leading-none mb-2', isHighlight ? 'text-white/70' : 'text-gray-400')}>
                $
              </span>
              <span className={cn('font-heading text-[52px] font-bold leading-none', isHighlight ? 'text-white' : 'text-navy')}>
                {monthlyPrice}
              </span>
            </>
          )}
        </div>
        {plan.price > 0 && (
          <p className={cn('font-sans text-xs', isHighlight ? 'text-white/50' : 'text-gray-400')}>
            {t(`plans.${plan.key}.billing`)}
          </p>
        )}
      </div>

      {/* CTA */}
      <Button
        variant={isHighlight ? 'gold' : 'outline'}
        size="lg"
        className="w-full justify-center"
        asChild
      >
        <Link href={`/${locale}/auth/signup`}>
          {t(`plans.${plan.key}.cta`)}
        </Link>
      </Button>

      {/* Feature list */}
      <ul className="flex flex-col gap-3 list-none">
        {(t.raw(`plans.${plan.key}.features`) as string[]).map((feature, i) => {
          const available = i < plan.unavailableFrom;
          return (
            <li key={i} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5">
                {available ? (
                  <Check
                    className={cn('size-4', isHighlight ? 'text-gold' : 'text-success')}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                ) : (
                  <X
                    className={cn('size-4', isHighlight ? 'text-white/25' : 'text-gray-200')}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span
                className={cn(
                  'font-sans text-sm leading-snug',
                  available
                    ? isHighlight ? 'text-white/88' : 'text-gray-800'
                    : isHighlight ? 'text-white/30' : 'text-gray-400',
                )}
              >
                {feature}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const t = useTranslations('home.pricing');

  return (
    <section id="pricing" className="bg-cream py-24 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
            {t('sectionLabel')}
          </span>
          <h2 className="font-heading text-[40px] font-bold text-navy mb-3">
            {t('title')}
          </h2>
          <p className="font-sans text-base text-gray-600 max-w-[500px] mx-auto mb-7">
            {t('subtitle')}
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full py-1.5 pl-3.5 pr-1.5">
            <span className="font-sans text-sm text-gray-600">{t('monthly')}</span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((a) => !a)}
              className="relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{ background: annual ? '#0F1F3D' : '#D0CEC8' }}
            >
              <span
                className="absolute top-[3px] size-[18px] rounded-full bg-white shadow-sm transition-all duration-200"
                style={{ left: annual ? 'calc(100% - 21px)' : '3px' }}
              />
            </button>
            <div className="flex items-center gap-1.5 pr-2">
              <span className={cn('font-sans text-sm font-medium', annual ? 'text-navy' : 'text-gray-600')}>
                {t('annual')}
              </span>
              <Badge variant="available" className="text-[11px] font-semibold px-2 py-0.5">
                {t('saveBadge')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PricingCard key={plan.key} plan={plan} annual={annual} />
          ))}
        </div>

        {/* Enterprise note */}
        <SurfaceCard
          radius="lg"
          elevation="none"
          padding="none"
          className="text-center mt-12 py-7 px-8"
        >
          <span className="font-sans text-sm text-gray-600">
            {t('enterpriseNote')}&nbsp;
            <Link
              href="#"
              className="text-navy font-semibold no-underline border-b border-b-gold hover:border-b-2 transition-all"
            >
              {t('enterpriseCta')}
            </Link>
          </span>
        </SurfaceCard>
      </div>
    </section>
  );
}
