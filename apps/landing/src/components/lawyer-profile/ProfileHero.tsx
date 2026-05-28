'use client';

import type { LawyerPublicProfileResponse } from '@repo/shared';
import type { TabItem } from '@repo/ui';
import { Badge, Button, StarRating, TabBar } from '@repo/ui';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import { SaveFavouriteButton } from '../shared/SaveFavouriteButton';
import type { Tab } from './types';

const TAB_ORDER: readonly Tab[] = ['about', 'reviews', 'availability', 'location'];

interface ProfileHeroProps {
  readonly lawyer: LawyerPublicProfileResponse;
  readonly activeTab: Tab;
  readonly onTabChange: (tab: Tab) => void;
  readonly tabLabels: Record<Tab, string>;
}

function deriveBadge(rating: number, reviewCount: number): 'topRated' | 'pro' | null {
  if (rating >= 4.8 && reviewCount >= 30) return 'topRated';
  if (reviewCount >= 15 && rating >= 4.5) return 'pro';
  return null;
}

export function ProfileHero({ lawyer, activeTab, onTabChange, tabLabels }: ProfileHeroProps) {
  const locale = useLocale();

  const name = `${lawyer.firstName} ${lawyer.lastName}`;
  const initials = `${lawyer.firstName.charAt(0)}${lawyer.lastName.charAt(0)}`.toUpperCase();
  const primarySpec = lawyer.specializations.find((s) => s.isPrimary) ?? lawyer.specializations[0];
  const rating = parseFloat(lawyer.avgRating ?? '0');
  const price = parseFloat(lawyer.pricePerHour ?? '0');
  const badge = deriveBadge(rating, lawyer.totalReviews);

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
          <LawyerAvatar
            initials={initials}
            verified
            photoUrl={lawyer.photoUrl}
            size="xl"
          />

          <div className="flex-1 pb-5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="font-heading text-3xl font-bold text-white">{name}</h1>
              {badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
              {badge === 'pro'      && <Badge variant="pro">Pro Member</Badge>}
              {lawyer.isInstantBooking && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-success bg-success-bg rounded-full px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-success" />
                  Available Today
                </span>
              )}
            </div>
            {primarySpec && (
              <p className="font-sans text-xs tracking-[0.08em] uppercase text-gold font-medium mb-3">
                {primarySpec.name}
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              <StarRating
                variant="row"
                rating={rating}
                count={lawyer.totalReviews}
                countClassName="text-white/70"
              />
              {lawyer.city && (
                <span className="flex items-center gap-1 font-sans text-sm text-white/60">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {lawyer.city}
                </span>
              )}
              {price > 0 && (
                <span className="font-sans text-sm text-white/60">
                  From ৳{price}/hr
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pb-5 shrink-0">
            <SaveFavouriteButton lawyerId={lawyer.id} className="text-white/70" />
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
