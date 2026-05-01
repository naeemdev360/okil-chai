'use client';

import { motion } from 'motion/react';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ResultCard } from './ResultCard';
import type { MatchResult, MatchAnalysis } from '../types';

interface ResultsStageProps {
  readonly results:  readonly MatchResult[];
  readonly analysis: MatchAnalysis;
  readonly onReset:  () => void;
}

export function ResultsStage({ results, analysis, onReset }: ResultsStageProps) {
  const t      = useTranslations('aiMatcher');
  const locale = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="bg-cream min-h-screen pb-20"
    >
      {/* Navy results header */}
      <div
        className="px-6 py-8"
        style={{ background: 'linear-gradient(160deg, var(--color-navy-mid) 0%, var(--color-navy) 100%)' }}
      >
        <div className="max-w-[960px] mx-auto">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 font-sans text-sm mb-5 text-white/65 cursor-pointer transition-opacity hover:opacity-80 bg-transparent border-0"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t('resultsNewSearch')}
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
              {t('resultsBadgePrefix')} · {analysis.practiceArea}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-[28px] font-semibold text-white leading-snug mb-2">
            {analysis.summary}
          </h1>
          <p className="font-sans text-sm text-white/60">{t('resultsSubtitle')}</p>
        </div>
      </div>

      {/* Result cards */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-4">
        {results.map((result, i) => (
          <ResultCard key={result.id} result={result} rank={i} />
        ))}

        <p className="text-center font-sans text-sm text-gray-500 py-6">
          {t('resultsNoFit')}{' '}
          <Link
            href={`/${locale}/search`}
            className="font-semibold text-navy underline underline-offset-2 hover:text-gold transition-colors"
          >
            {t('resultsBrowseAll')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
