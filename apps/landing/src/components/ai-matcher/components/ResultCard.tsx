'use client';

import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button, SurfaceCard, StarRating } from '@okil-chai/ui';
import { LawyerAvatar } from '../../shared/LawyerAvatar';
import { MatchScoreBadge } from './MatchScoreBadge';
import type { MatchResult } from '../types';

interface ResultCardProps {
  readonly result: MatchResult;
  readonly rank:   number;
}

export function ResultCard({ result, rank }: ResultCardProps) {
  const t      = useTranslations('aiMatcher');
  const locale = useLocale();
  const isBest = rank === 0;

  return (
    <SurfaceCard
      asChild
      radius="xl"
      elevation={isBest ? 'lg' : 'sm'}
      padding="none"
      className="relative overflow-hidden"
    >
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.1, duration: 0.3, ease: [0.2, 0, 0, 1] }}
      >
      {/* Gold top accent on best match */}
      {isBest && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))' }}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-7 pt-6">
        {/* Avatar + score badge */}
        <div className="relative shrink-0 self-start">
          <LawyerAvatar initials={result.initials} verified size="lg" />
          <MatchScoreBadge score={result.matchScore} isBest={isBest} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <h3 className="font-heading text-[19px] font-semibold text-navy leading-tight">
              {result.name}
            </h3>
            {isBest && (
              <span className="font-sans text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full bg-gold/15 text-gold">
                {t('resultsBestMatch')}
              </span>
            )}
          </div>

          <p className="font-sans text-[11px] tracking-[0.06em] uppercase text-gold font-medium mb-2.5">
            {result.specialization}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StarRating rating={result.rating} count={result.reviewCount} />
            <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              {result.city}
            </span>
            <span className="font-sans text-xs text-gray-400">
              {result.languages.join(' · ')}
            </span>
          </div>

          {/* Why this match callout */}
          <div className="rounded-md px-4 py-3 bg-gold-pale border-l-[3px] border-gold">
            <p className="font-sans text-sm text-gray-800 leading-relaxed">
              <span className="font-semibold text-navy">{t('resultsWhyMatch')} </span>
              {result.reasoning}
            </p>
          </div>
        </div>

        {/* Price + CTAs */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 shrink-0">
          <div className="text-right">
            <p className="font-heading text-2xl font-bold text-navy leading-none">
              ${result.pricePerHour}
            </p>
            <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('resultsPerHour')}</p>
          </div>
          <div className="flex sm:flex-col gap-2">
            <Button variant="gold" size="sm" asChild className="justify-center">
              <Link href={`/${locale}/lawyers/${result.id}`}>{t('resultsBookNow')}</Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="justify-center">
              <Link href={`/${locale}/lawyers/${result.id}`}>{t('resultsViewProfile')}</Link>
            </Button>
          </div>
        </div>
      </div>
      </motion.article>
    </SurfaceCard>
  );
}
