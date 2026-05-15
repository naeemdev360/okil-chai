'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Video, Phone, Building2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn, Badge, VerifiedCheckIcon, SurfaceCard, StarRating } from '@repo/ui';
import type { Lawyer } from '../../lib/search/mock-lawyers';

type ConsultType = 'video' | 'phone' | 'in-person';

const CONSULT_ICON: Record<ConsultType, React.ElementType> = {
  video:       Video,
  phone:       Phone,
  'in-person': Building2,
};

const CONSULT_LABEL_KEY: Record<ConsultType, string> = {
  video:       'video',
  phone:       'phone',
  'in-person': 'inPerson',
};

interface LawyerCardGridProps {
  readonly lawyer: Lawyer;
}

function GridAvatar({ initials, verified }: { initials: string; verified: boolean }) {
  return (
    <div className="relative mb-4">
      <div className="size-24 rounded-full bg-white/10 border-[2.5px] border-white/25 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
        <span className="font-heading text-[32px] font-bold text-white leading-none tracking-tight">
          {initials}
        </span>
      </div>
      {verified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-6 bg-gold rounded-full flex items-center justify-center ring-[2.5px] ring-navy shadow-sm"
          aria-label="Verified"
        >
          <VerifiedCheckIcon className="size-3" />
        </span>
      )}
    </div>
  );
}

export function LawyerCardGrid({ lawyer }: LawyerCardGridProps) {
  const [hovered, setHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('search');

  return (
    <SurfaceCard
      asChild
      elevation="sm"
      padding="none"
      className={cn(
        'group flex flex-col overflow-hidden transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        hovered
          ? 'shadow-[0_20px_60px_rgba(15,31,61,0.18)] -translate-y-1.5 scale-[1.012]'
          : 'scale-100',
      )}
    >
      <Link
        href={`/${locale}/lawyers/${lawyer.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`View ${lawyer.name}'s profile — ${lawyer.specialization}`}
      >
      {/* ── Visual header ───────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-navy via-navy to-navy-mid pt-6 pb-5 px-5 flex flex-col items-center">

        {/* Top-left: availability dot */}
        {lawyer.availableToday && (
          <span className="absolute top-3 left-3.5 inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-success bg-success-bg rounded-full px-2 py-0.5">
            <span className="size-1.5 rounded-full bg-success" />
            Available
          </span>
        )}

        {/* Top-right: badge */}
        <div className="absolute top-3 right-3">
          {lawyer.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
          {lawyer.badge === 'pro'      && <Badge variant="pro">Pro</Badge>}
          {lawyer.badge === 'new'      && <Badge variant="outline" className="border-white/30 text-white/70">New</Badge>}
        </div>

        <GridAvatar initials={lawyer.initials} verified={lawyer.verified} />

        <h3 className="font-heading text-[18px] font-semibold text-white text-center leading-tight mb-1 tracking-tight">
          {lawyer.name}
        </h3>
        <p className="font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-gold">
          {lawyer.specialization}
        </p>
      </div>

      {/* ── Card body ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Rating + city row */}
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={lawyer.rating} count={lawyer.reviewCount} />
          <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
            <MapPin className="size-3 shrink-0" aria-hidden />
            {lawyer.city}
          </span>
        </div>

        {/* Bio — 2-line clamp */}
        <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
          {lawyer.bio}
        </p>

        {/* Consult type pills */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {lawyer.consultTypes.map((type) => {
            const Icon = CONSULT_ICON[type];
            return (
              <span
                key={type}
                className="inline-flex items-center gap-1 font-sans text-[10px] font-medium text-gray-600 bg-gray-50 rounded-full px-2.5 py-1"
              >
                <Icon className="size-2.5 shrink-0" aria-hidden />
                {t(`consultTypes.${CONSULT_LABEL_KEY[type]}`)}
              </span>
            );
          })}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
          <div className="font-sans">
            <span className="text-[15px] font-bold text-navy">${lawyer.pricePerHour}</span>
            <span className="text-xs text-gray-400">/hr</span>
          </div>
          {/* Rendered as span — parent Link handles navigation */}
          <span className={cn(
            'inline-flex items-center font-sans text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors duration-150',
            hovered
              ? 'bg-gold text-navy'
              : 'bg-gold/10 text-gold',
          )}>
            {t('card.viewProfile')}
          </span>
        </div>
      </div>
      </Link>
    </SurfaceCard>
  );
}
