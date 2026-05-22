'use client';

import { Role } from '@repo/shared';
import { Button, cn, SurfaceCard } from '@repo/ui';
import {
  Briefcase, Calendar, Camera, Check, ChevronLeft, ChevronRight,
  DollarSign, Lock, Shield, User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { brand } from '../../lib/brand';
import { EmailVerificationGate } from '../auth/EmailVerificationGate';
import { StepIcon } from './wizard/ui';
import {
  StepAccount, StepAvailability, StepCredentials,
  StepPersonal, StepPhoto, StepPricing, StepSpecs,
} from './wizard/steps';
import { useOnboardingWizard } from './wizard/useOnboardingWizard';
import type { WizardData, UpdateFn } from './wizard/types';

// ─── Steps rendering config (icons + content — presentation only) ─────────────

const ALL_STEPS = [
  { key: 'account',      icon: Lock,       content: (d: WizardData, u: UpdateFn, e: Record<string, string>) => <StepAccount      data={d} update={u} errors={e} /> },
  { key: 'personal',     icon: User,       content: (d: WizardData, u: UpdateFn, e: Record<string, string>) => <StepPersonal     data={d} update={u} errors={e} /> },
  { key: 'credentials',  icon: Shield,     content: (d: WizardData, u: UpdateFn, e: Record<string, string>) => <StepCredentials  data={d} update={u} errors={e} /> },
  { key: 'specs',        icon: Briefcase,  content: (d: WizardData, u: UpdateFn, e: Record<string, string>) => <StepSpecs        data={d} update={u} errors={e} /> },
  { key: 'pricing',      icon: DollarSign, content: (d: WizardData, u: UpdateFn, e: Record<string, string>) => <StepPricing      data={d} update={u} errors={e} /> },
  { key: 'availability', icon: Calendar,   content: (d: WizardData, u: UpdateFn, e: Record<string, string>) => <StepAvailability data={d} update={u} errors={e} /> },
  { key: 'photo',        icon: Camera,     content: (d: WizardData, _u: UpdateFn, _e: Record<string, string>) => <StepPhoto      data={d} />                       },
] as const;

const AUTH_STEPS = ALL_STEPS.slice(1);

// ─── Wizard ───────────────────────────────────────────────────────────────────

export function LawyerOnboardingWizard() {
  const t = useTranslations('onboarding.lawyer');

  const {
    user,
    isAuthLoading,
    isAuthenticated,
    stepIdx,
    data,
    stepErrors,
    submitError,
    isSubmitting,
    update,
    handleContinue,
    handleBack,
    handleSubmit,
  } = useOnboardingWizard();

  const activeSteps   = isAuthenticated ? AUTH_STEPS : ALL_STEPS;
  const currentStep   = activeSteps[stepIdx]!;
  const progressWidth = stepIdx === 0
    ? '0%'
    : `calc(${(stepIdx / (activeSteps.length - 1)) * 100}% - 38px)`;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-sans text-sm text-gray-500 animate-pulse">{t('loadingAuth')}</p>
      </div>
    );
  }

  if (!isAuthenticated || (user && !user.roles.includes(Role.LAWYER))) {
    return null;
  }

  if (user && !user.isVerified) {
    return <EmailVerificationGate email={user.email} />;
  }

  if (user?.onboardingComplete) {
    const portalUrl = process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px] text-center">
          <div className="size-20 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-6">
            <Check className="size-9 text-success" strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="font-heading text-[28px] font-semibold text-navy mb-3">
            {t('alreadyComplete.heading')}
          </h1>
          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-8">
            {t('alreadyComplete.body')}
          </p>
          {portalUrl && (
            <Button
              variant="gold"
              size="lg"
              className="w-full justify-center"
              onClick={() => { window.location.href = `${portalUrl}/dashboard`; }}
            >
              {t('alreadyComplete.cta')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero band */}
      <div className="bg-navy px-8 pt-10 pb-20 text-white">
        <div className="max-w-[880px] mx-auto">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-2.5 block">
            {t('tagline', { appName: brand.name })}
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
              {activeSteps.map(({ key, icon }, i) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { if (i < stepIdx) handleBack(); }}
                  disabled={i > stepIdx || isSubmitting}
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
                {t('stepOf', { current: stepIdx + 1, total: activeSteps.length })}
              </p>
              <h2 className="font-heading text-[26px] font-semibold text-navy">
                {t(`steps.${currentStep.key}`)}
              </h2>
            </div>
          </div>

          {/* Step content */}
          <div className="px-9 py-8">
            {currentStep.content(data, update, stepErrors)}
          </div>

          {/* Submit-level error */}
          {submitError && (
            <div className="px-9 pb-4">
              <p className="font-sans text-sm text-error">{submitError}</p>
            </div>
          )}

          {/* Footer nav */}
          <div className="px-9 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 font-sans text-sm text-gray-600 hover:text-navy transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {stepIdx === 0 ? t('cancel') : t('back')}
            </button>

            {stepIdx < activeSteps.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => { void handleContinue(); }}
                isLoading={isSubmitting}
                loadingText={t('saving')}
              >
                {t('continue')}
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="gold"
                size="md"
                onClick={() => { void handleSubmit(); }}
                isLoading={isSubmitting}
                loadingText={t('submitting')}
              >
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
