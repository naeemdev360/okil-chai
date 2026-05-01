'use client';

import { Sparkles, ArrowRight, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn, Button, TogglePill } from '@okil-chai/ui';
import { SAMPLE_KEYS, URGENCY_KEYS, BUDGET_KEYS } from '../constants';
import type { UrgencyKey, BudgetKey } from '../types';

interface IntroStageProps {
  readonly description:     string;
  readonly urgency:         UrgencyKey;
  readonly budget:          BudgetKey;
  readonly error:           string | null;
  readonly onDescChange:    (val: string) => void;
  readonly onUrgencyChange: (key: UrgencyKey) => void;
  readonly onBudgetChange:  (key: BudgetKey) => void;
  readonly onSubmit:        () => void;
}

export function IntroStage({
  description, urgency, budget, error,
  onDescChange, onUrgencyChange, onBudgetChange, onSubmit,
}: IntroStageProps) {
  const t = useTranslations('aiMatcher');

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Navy header — gradient uses CSS tokens */}
      <div
        className="relative overflow-hidden px-6 pt-14 pb-28"
        style={{
          background: 'linear-gradient(160deg, var(--color-navy-mid) 0%, var(--color-navy) 55%, #070d1a 100%)',
        }}
      >
        {/* Ambient gold glow */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: -100, right: -100, width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--color-gold) 20%, transparent) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-[760px] mx-auto relative">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 bg-gold/[0.16]">
            <Sparkles className="size-3.5 text-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
              {t('tagline')}
            </span>
          </div>

          <h1
            className="font-heading font-bold text-white leading-[1.12] mb-4"
            style={{ fontSize: 'clamp(32px, 5.5vw, 48px)' }}
          >
            {t('title')}<br />
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(138deg, var(--color-gold-light) 0%, var(--color-gold) 52%, #F2DC78 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('titleHighlight')}
            </em>
          </h1>

          <p className="font-sans text-base leading-relaxed max-w-[560px] text-white/70">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Floating card overlapping the header */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 -mt-[72px] relative">
        <div
          className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {/* Textarea */}
          <label className="block font-sans text-sm font-semibold text-navy mb-2.5">
            {t('inputLabel')}
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescChange(e.target.value)}
            placeholder={t('inputPlaceholder')}
            rows={5}
            aria-describedby="ai-char-hint"
            className={cn(
              'w-full rounded-lg border px-4 py-3.5 font-sans text-sm text-gray-800 leading-relaxed resize-y outline-none transition-colors duration-150 placeholder:text-gray-400',
              error ? 'border-error focus:border-error' : 'border-gray-200 focus:border-navy',
            )}
          />
          <div id="ai-char-hint" className="flex justify-between mt-1.5 mb-1">
            <span className={cn('font-sans text-[11px]', error ? 'text-error' : 'text-gray-400')}>
              {error ?? t('charCount', { count: description.length })}
            </span>
            <span className="font-sans text-[11px] text-gray-400">{t('minChars')}</span>
          </div>

          {/* Sample prompts */}
          <div className="mt-5 mb-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 mb-2">
              {t('samplesLabel')}
            </p>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onDescChange(t(`samples.${key}`))}
                  className="text-left px-3.5 py-2.5 rounded-md border border-gray-100 bg-cream font-sans text-xs text-gray-700 transition-all duration-150 hover:bg-gold-pale hover:border-gold cursor-pointer"
                >
                  "{t(`samples.${key}`)}"
                </button>
              ))}
            </div>
          </div>

          {/* Urgency + Budget pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
            <div>
              <p className="font-sans text-sm font-semibold text-navy mb-2">{t('urgencyLabel')}</p>
              <div className="flex gap-1.5">
                {URGENCY_KEYS.map((key) => (
                  <TogglePill
                    key={key}
                    active={urgency === key}
                    onClick={() => onUrgencyChange(key)}
                    className="flex-1"
                  >
                    {t(`urgency.${key}`)}
                  </TogglePill>
                ))}
              </div>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-navy mb-2">{t('budgetLabel')}</p>
              <div className="flex gap-1.5">
                {BUDGET_KEYS.map((key) => (
                  <TogglePill
                    key={key}
                    active={budget === key}
                    onClick={() => onBudgetChange(key)}
                    className="flex-1"
                  >
                    {t(`budget.${key}`)}
                  </TogglePill>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="gold"
            size="lg"
            onClick={onSubmit}
            className="w-full justify-center gap-2 text-base py-4"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {t('cta')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <p className="mt-4 text-center font-sans text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            {t('privacy')}
          </p>
        </div>
      </div>
    </div>
  );
}
