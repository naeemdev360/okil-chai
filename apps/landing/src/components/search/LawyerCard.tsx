'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Video, Phone, Building2, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn, Button, Badge } from '@okil-chai/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import type { Lawyer } from '../../lib/search/mock-lawyers';

type ConsultType = 'video' | 'phone' | 'in-person';

const CONSULT_META: Record<ConsultType, { icon: React.ElementType; labelKey: string }> = {
  video:       { icon: Video,     labelKey: 'video'     },
  phone:       { icon: Phone,     labelKey: 'phone'     },
  'in-person': { icon: Building2, labelKey: 'inPerson'  },
};

interface LawyerCardProps {
  readonly lawyer: Lawyer;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const [hovered, setHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('search');

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'bg-white border border-gray-100 rounded-xl p-5 md:p-6 flex gap-4 items-start transition-all duration-200',
        hovered ? 'shadow-[0_8px_32px_rgba(15,31,61,0.12)] -translate-y-0.5' : 'shadow-[0_1px_4px_rgba(15,31,61,0.06)]',
      )}
    >
      <LawyerAvatar initials={lawyer.initials} verified={lawyer.verified} />

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Name + badges */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span className="font-heading text-[17px] font-semibold text-navy leading-tight">
            {lawyer.name}
          </span>
          <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
            {lawyer.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
            {lawyer.badge === 'pro'      && <Badge variant="pro">Pro Member</Badge>}
            {lawyer.badge === 'new'      && <Badge variant="outline">New</Badge>}
          </div>
        </div>

        {/* Specialization */}
        <p className="font-sans text-[11px] tracking-[0.06em] uppercase text-gold font-medium mb-2">
          {lawyer.specialization}
        </p>

        {/* Rating + location */}
        <div className="flex items-center gap-3 flex-wrap mb-2.5">
          <span className="flex items-center gap-1 font-sans text-sm">
            <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
            <span className="font-medium text-navy">{lawyer.rating}</span>
            <span className="text-gray-400">({lawyer.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {lawyer.city}
          </span>
        </div>

        {/* Bio */}
        <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">
          {lawyer.bio}
        </p>

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
            <span className="font-sans text-sm font-medium text-navy">
              {t('card.fromPrice', { price: lawyer.pricePerHour })}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/lawyers/${lawyer.id}`}>
                {t('card.viewProfile')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
