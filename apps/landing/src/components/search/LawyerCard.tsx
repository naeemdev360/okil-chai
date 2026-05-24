'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Video, Phone, Building2, Briefcase, Globe2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn, Button, Badge, SurfaceCard, StarRating } from '@repo/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import type { LawyerDisplay } from '../../lib/search/lawyer-display';
import type { ConsultTypeUI } from '../../lib/search/lawyer-display';

const CONSULT_META: Record<ConsultTypeUI, { icon: React.ElementType; labelKey: string }> = {
  video:       { icon: Video,     labelKey: 'video'    },
  phone:       { icon: Phone,     labelKey: 'phone'    },
  'in-person': { icon: Building2, labelKey: 'inPerson' },
};

interface LawyerCardProps {
  readonly lawyer: LawyerDisplay;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const [hovered, setHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('search');

  return (
    <SurfaceCard
      asChild
      radius="xl"
      elevation={hovered ? 'lg' : 'sm'}
      padding="none"
      className={cn(
        'flex gap-4 items-start transition-all duration-200 p-5 md:p-6',
        hovered && '-translate-y-0.5',
      )}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <LawyerAvatar
          initials={lawyer.initials}
          verified={lawyer.verified}
          photoUrl={lawyer.photoUrl}
          size="lg"
        />

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-heading text-[17px] font-semibold text-navy leading-tight">
                {lawyer.name}
              </span>
              {lawyer.availableToday && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-success bg-success-bg rounded-full px-2 py-0.5 shrink-0">
                  <span className="size-1.5 rounded-full bg-success" />
                  Available
                </span>
              )}
            </div>
            <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
              {lawyer.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
              {lawyer.badge === 'pro'      && <Badge variant="pro">Pro Member</Badge>}
              {lawyer.badge === 'new'      && <Badge variant="outline">New</Badge>}
            </div>
          </div>

          {/* Specialization */}
          <p className="font-sans text-[11px] tracking-[0.06em] uppercase text-gold font-medium mb-2">
            {lawyer.primarySpecialization}
          </p>

          {/* Rating + location */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <StarRating rating={lawyer.rating} count={lawyer.reviewCount} />
            {lawyer.city && (
              <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {lawyer.city}
              </span>
            )}
          </div>

          {/* Experience + languages */}
          {(lawyer.yearsOfExperience != null || lawyer.languages.length > 0) && (
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              {lawyer.yearsOfExperience != null && (
                <span className="inline-flex items-center gap-1 font-sans text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
                  <Briefcase className="size-3 shrink-0" aria-hidden />
                  {lawyer.yearsOfExperience} yrs exp
                </span>
              )}
              {lawyer.languages.length > 0 && (
                <span className="inline-flex items-center gap-1 font-sans text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
                  <Globe2 className="size-3 shrink-0" aria-hidden />
                  {lawyer.languages.slice(0, 2).join(', ')}
                  {lawyer.languages.length > 2 && ` +${lawyer.languages.length - 2}`}
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {lawyer.bio && (
            <p className="font-sans text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
              {lawyer.bio}
            </p>
          )}

          {/* Footer: consult types + price + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {lawyer.consultTypes.map((type) => {
                const { icon: Icon, labelKey } = CONSULT_META[type];
                return (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1"
                  >
                    <Icon className="size-3 shrink-0" aria-hidden="true" />
                    {t(`consultTypes.${labelKey}`)}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              {lawyer.pricePerHour > 0 && (
                <span className="font-sans text-sm font-medium text-navy">
                  {t('card.fromPrice', { price: lawyer.pricePerHour })}
                </span>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/lawyers/${lawyer.id}`}>
                  {t('card.viewProfile')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </SurfaceCard>
  );
}
