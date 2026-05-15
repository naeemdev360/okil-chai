'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Badge, Button, StarRating, TabBar } from '@repo/ui';
import type { TabItem } from '@repo/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { Tab } from './types';

const TAB_ORDER: readonly Tab[] = ['about', 'reviews', 'availability', 'location'];

interface ProfileHeroProps {
  readonly lawyer: Lawyer;
  readonly activeTab: Tab;
  readonly onTabChange: (tab: Tab) => void;
  readonly tabLabels: Record<Tab, string>;
}

export function ProfileHero({ lawyer, activeTab, onTabChange, tabLabels }: ProfileHeroProps) {
  const locale = useLocale();

  const tabItems: readonly TabItem[] = TAB_ORDER.map((key) => ({
    id: key,
    label: tabLabels[key],
  }));

  return (
    <div className="bg-navy px-6 pt-6 pb-0">
      <div className="max-w-[1200px] mx-auto">
        <Link
          href={`/${locale}/search`}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-white/60 hover:text-white mb-6 transition-colors duration-150"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Results
        </Link>

        <div className="flex gap-7 items-end flex-wrap md:flex-nowrap">
          <LawyerAvatar initials={lawyer.initials} verified={lawyer.verified} size="lg" />

          <div className="flex-1 pb-5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="font-heading text-3xl font-bold text-white">{lawyer.name}</h1>
              {lawyer.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
              {lawyer.badge === 'pro'      && <Badge variant="pro">Pro Member</Badge>}
            </div>
            <p className="font-sans text-xs tracking-[0.08em] uppercase text-gold font-medium mb-3">
              {lawyer.specialization}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <StarRating
                variant="row"
                rating={lawyer.rating}
                count={lawyer.reviewCount}
                countClassName="text-white/70"
              />
              <span className="flex items-center gap-1 font-sans text-sm text-white/60">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {lawyer.city}
              </span>
              <span className="font-sans text-sm text-white/60">
                From ${lawyer.pricePerHour}/hr
              </span>
            </div>
          </div>

          <div className="pb-5 shrink-0">
            <Button variant="gold" size="lg" asChild>
              <Link href={`/${locale}/book/${lawyer.id}`}>Book Consultation</Link>
            </Button>
          </div>
        </div>

        <TabBar
          items={tabItems}
          active={activeTab}
          onChange={(id) => onTabChange(id as Tab)}
          variant="dark"
          className="border-t border-white/12 mt-2"
        />
      </div>
    </div>
  );
}
