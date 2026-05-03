'use client';

import { motion } from 'motion/react';
import { Sparkles, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SurfaceCard } from '@okil-chai/ui';
import { ANALYZING_STEP_KEYS } from '../constants';

export function AnalyzingStage() {
  const t = useTranslations('aiMatcher');

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-[440px] w-full">
        {/* Pulsing navy orb */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="size-24 rounded-full bg-navy flex items-center justify-center"
            animate={{
              scale: [1, 1.06, 1],
              boxShadow: [
                '0 0 0 0 color-mix(in srgb, var(--color-gold) 50%, transparent)',
                '0 0 0 22px transparent',
                '0 0 0 0 transparent',
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <Sparkles className="size-10 text-gold" />
          </motion.div>
        </div>

        <h2 className="font-heading text-2xl font-semibold text-navy mb-3">
          {t('analyzingTitle')}
        </h2>
        <p className="font-sans text-sm text-gray-600 leading-relaxed mb-8">
          {t('analyzingSubtitle')}
        </p>

        {/* Staggered step checklist */}
        <div className="flex flex-col gap-2.5 text-left" role="status" aria-live="polite">
          {ANALYZING_STEP_KEYS.map((key, i) => (
            <SurfaceCard
              key={key}
              asChild
              radius="lg"
              elevation="none"
              padding="none"
              className="flex items-center gap-3 font-sans text-sm text-gray-800 px-4 py-3"
            >
              <motion.div
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.7, duration: 0.4 }}
              >
              <span className="size-5 rounded-full bg-gold flex items-center justify-center shrink-0">
                <Check className="size-3 text-navy" strokeWidth={2.5} aria-hidden="true" />
              </span>
              {t(`analyzingSteps.${key}`)}
              </motion.div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </div>
  );
}
