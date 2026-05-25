'use client';

import { motion }                   from 'motion/react';
import { MapPin, Sparkles, Globe2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link                         from 'next/link';
import { cn, Button, SurfaceCard, StarRating } from '@repo/ui';
import { LawyerAvatar }             from '../../shared/LawyerAvatar';
import type { MatchResult }         from '../types';

interface ResultCardProps {
  readonly result: MatchResult;
  readonly rank:   number;
}

function MatchScorePill({ score, isBest }: { score: number; isBest: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-[11px] font-bold tracking-wide',
        isBest
          ? 'bg-gold text-navy'
          : 'bg-navy/8 text-navy border border-navy/12',
      )}
    >
      <Sparkles className="size-3 shrink-0" aria-hidden="true" />
      {score}% {isBest ? 'Best Match' : 'Match'}
    </span>
  );
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
      className={cn('relative overflow-hidden transition-shadow duration-200', isBest && 'bg-gold-pale/40')}
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.12, duration: 0.32, ease: [0.2, 0, 0, 1] }}
      >
        {/* Gold accent bar — best match only */}
        {isBest && (
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))' }}
            aria-hidden="true"
          />
        )}

        {/* Ambient glow — best match only */}
        {isBest && (
          <div
            className="absolute -top-16 -right-16 size-56 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, color-mix(in srgb, var(--color-gold) 12%, transparent) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6 pt-6">

          {/* ── Left: avatar column ── */}
          <div className="flex sm:flex-col items-start gap-4 sm:gap-3 shrink-0">
            <LawyerAvatar
              initials={result.initials}
              photoUrl={result.photoUrl}
              verified
              size={isBest ? 'xl' : 'lg'}
            />
            <div className="flex sm:hidden flex-col gap-1 min-w-0">
              <h3 className="font-heading text-[18px] font-semibold text-navy leading-tight">
                {result.name}
              </h3>
              <p className="font-sans text-[11px] tracking-[0.06em] uppercase text-gold font-semibold">
                {result.specialization}
              </p>
            </div>
          </div>

          {/* ── Center: info ── */}
          <div className="flex-1 min-w-0">
            {/* Name + score pill — desktop */}
            <div className="hidden sm:flex items-start justify-between gap-3 mb-0.5">
              <h3 className="font-heading text-[19px] font-semibold text-navy leading-tight">
                {result.name}
              </h3>
              <MatchScorePill score={result.matchScore} isBest={isBest} />
            </div>

            {/* Score pill — mobile */}
            <div className="flex sm:hidden mb-2.5">
              <MatchScorePill score={result.matchScore} isBest={isBest} />
            </div>

            {/* Specialization — desktop */}
            <p className="hidden sm:block font-sans text-[11px] tracking-[0.06em] uppercase text-gold font-semibold mb-3">
              {result.specialization}
            </p>

            {/* Rating + meta row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <StarRating rating={result.rating} count={result.reviewCount} />
              {result.city && (
                <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
                  <MapPin className="size-3 shrink-0" aria-hidden="true" />
                  {result.city}
                </span>
              )}
              {result.languages.length > 0 && (
                <span className="flex items-center gap-1 font-sans text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
                  <Globe2 className="size-3 shrink-0" aria-hidden="true" />
                  {result.languages.join(' · ')}
                </span>
              )}
            </div>

            {/* Why this match */}
            <div
              className={cn(
                'flex gap-2.5 rounded-xl px-4 py-3',
                isBest
                  ? 'bg-gold/10 border border-gold/25'
                  : 'bg-gray-50 border border-gray-100',
              )}
            >
              <Sparkles
                className={cn('size-3.5 mt-0.5 shrink-0', isBest ? 'text-gold' : 'text-gray-400')}
                aria-hidden="true"
              />
              <p className="font-sans text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-navy">{t('resultsWhyMatch')} </span>
                {result.reasoning}
              </p>
            </div>
          </div>

          {/* ── Right: price + CTAs ── */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 sm:min-w-[120px]">
            <div className="text-right">
              <p className="font-heading text-[26px] font-bold text-navy leading-none">
                ${result.pricePerHour}
              </p>
              <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('resultsPerHour')}</p>
            </div>
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <Button
                variant={isBest ? 'gold' : 'outline'}
                size="sm"
                asChild
                className="flex-1 sm:flex-none justify-center sm:w-full"
              >
                <Link href={`/${locale}/lawyers/${result.id}`}>{t('resultsBookNow')}</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 sm:flex-none justify-center sm:w-full"
              >
                <Link href={`/${locale}/lawyers/${result.id}`}>{t('resultsViewProfile')}</Link>
              </Button>
            </div>
          </div>

        </div>
      </motion.article>
    </SurfaceCard>
  );
}
