'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  User, Shield, Briefcase, DollarSign, Calendar, Camera, Lock,
  ChevronLeft, ChevronRight, Check,
} from 'lucide-react';
import { Button, cn, SurfaceCard } from '@okil-chai/ui';
import { StepIcon } from './wizard/ui';
import {
  StepAccount, StepPersonal, StepCredentials,
  StepSpecs, StepPricing, StepAvailability, StepPhoto,
} from './wizard/steps';
import { INITIAL_DATA } from './wizard/constants';
import type { WizardData, UpdateFn } from './wizard/types';

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { key: 'account',      icon: Lock,       content: (d: WizardData, u: UpdateFn) => <StepAccount      data={d} update={u} /> },
  { key: 'personal',     icon: User,       content: (d: WizardData, u: UpdateFn) => <StepPersonal     data={d} update={u} /> },
  { key: 'credentials',  icon: Shield,     content: (d: WizardData, u: UpdateFn) => <StepCredentials  data={d} update={u} /> },
  { key: 'specs',        icon: Briefcase,  content: (d: WizardData, u: UpdateFn) => <StepSpecs        data={d} update={u} /> },
  { key: 'pricing',      icon: DollarSign, content: (d: WizardData, u: UpdateFn) => <StepPricing      data={d} update={u} /> },
  { key: 'availability', icon: Calendar,   content: (d: WizardData, u: UpdateFn) => <StepAvailability data={d} update={u} /> },
  { key: 'photo',        icon: Camera,     content: (d: WizardData, _: UpdateFn) => <StepPhoto        data={d} />            },
] as const;

// ─── Wizard ───────────────────────────────────────────────────────────────────

export function LawyerOnboardingWizard() {
  const [stepIdx, setStepIdx] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const t      = useTranslations('onboarding.lawyer');
  const router = useRouter();
  const locale = useLocale();

  const update: UpdateFn = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const progressWidth = stepIdx === 0
    ? '0%'
    : `calc(${(stepIdx / (STEPS.length - 1)) * 100}% - 38px)`;

  const handleSubmit = () => {
    localStorage.setItem('okilchai_lawyer_pending', 'true');
    const portalUrl = process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL;
    if (portalUrl) {
      window.location.href = `${portalUrl}/dashboard`;
    } else {
      router.push(`/${locale}/`);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero band */}
      <div className="bg-navy px-8 pt-10 pb-20 text-white">
        <div className="max-w-[880px] mx-auto">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-2.5 block">
            {t('tagline')}
          </span>
          <h1 className="font-heading text-[36px] font-bold mb-2">{t('title')}</h1>
          <p className="font-sans text-[15px] text-white/70">{t('subtitle')}</p>
        </div>
      </div>

      {/* Wizard card */}
      <div className="max-w-[880px] mx-auto -mt-14 px-6">
        <SurfaceCard elevation="lg" padding="none" className="overflow-hidden">

          {/* Stepper */}
          <div className="px-9 pt-7 border-b border-gray-100">
            <div className="relative flex justify-between items-center">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-gold transition-all duration-300"
                style={{ width: progressWidth }}
              />
              {STEPS.map(({ key, icon }, i) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => i <= stepIdx && setStepIdx(i)}
                  disabled={i > stepIdx}
                  className="relative z-10 flex flex-col items-center gap-2 disabled:cursor-default"
                >
                  <StepIcon icon={icon} done={i < stepIdx} active={i === stepIdx} />
                  <span className={cn(
                    'font-sans text-[11px] whitespace-nowrap',
                    i === stepIdx ? 'font-semibold text-navy' : 'text-gray-400',
                  )}>
                    {t(`steps.${key}`)}
                  </span>
                </button>
              ))}
            </div>

            <div className="py-6">
              <p className="font-sans text-xs text-gold font-semibold tracking-[0.06em] uppercase mb-1.5">
                {t('stepOf', { current: stepIdx + 1, total: STEPS.length })}
              </p>
              <h2 className="font-heading text-[26px] font-semibold text-navy">
                {t(`steps.${STEPS[stepIdx]!.key}`)}
              </h2>
            </div>
          </div>

          {/* Step content */}
          <div className="px-9 py-8">
            {STEPS[stepIdx]!.content(data, update)}
          </div>

          {/* Footer nav */}
          <div className="px-9 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => stepIdx === 0 ? router.push(`/${locale}/auth`) : setStepIdx((i) => i - 1)}
              className="inline-flex items-center gap-1.5 font-sans text-sm text-gray-600 hover:text-navy transition-colors"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {stepIdx === 0 ? t('cancel') : t('back')}
            </button>

            {stepIdx < STEPS.length - 1 ? (
              <Button variant="primary" size="md" onClick={() => setStepIdx((i) => i + 1)}>
                {t('continue')}
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="gold" size="md" onClick={handleSubmit}>
                {t('submit')}
                <Check className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
