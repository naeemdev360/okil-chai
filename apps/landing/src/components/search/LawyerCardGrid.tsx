'use client';

import { ConsultationType } from '@repo/shared';
import { useIsFavourited, useToggleFavourite } from '@repo/hooks';
import { LawyerGridCard } from '@repo/ui';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth.store';
import type { LawyerDisplay, ConsultTypeUI } from '../../lib/search/lawyer-display';

const CONSULT_TYPE_MAP: Record<ConsultTypeUI, ConsultationType> = {
  'video':     ConsultationType.VIDEO,
  'phone':     ConsultationType.PHONE,
  'in-person': ConsultationType.IN_PERSON,
};

interface LawyerCardGridProps {
  readonly lawyer: LawyerDisplay;
}

export function LawyerCardGrid({ lawyer }: LawyerCardGridProps) {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const { data: statusData, isLoading: statusLoading } = useIsFavourited(
    isAuthenticated ? lawyer.id : '',
  );
  const { mutate: toggle, isPending } = useToggleFavourite();

  function handleFavourite(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/signin?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    toggle(lawyer.id);
  }

  return (
    <LawyerGridCard
      data={{
        id:                    lawyer.id,
        initials:              lawyer.initials,
        name:                  lawyer.name,
        primarySpecialization: lawyer.primarySpecialization,
        rating:                lawyer.rating,
        reviewCount:           lawyer.reviewCount,
        pricePerHour:          lawyer.pricePerHour,
        city:                  lawyer.city,
        verified:              lawyer.verified,
        consultTypes:          lawyer.consultTypes.map((t) => CONSULT_TYPE_MAP[t]),
        badge:                 lawyer.badge,
        bio:                   lawyer.bio,
        availableToday:        lawyer.availableToday,
        photoUrl:              lawyer.photoUrl,
        yearsOfExperience:     lawyer.yearsOfExperience,
        languages:             lawyer.languages as string[],
      }}
      currency="$"
      labels={{ viewProfile: 'View Profile' }}
      isFavourited={statusData?.isFavourited ?? false}
      isFavouriteLoading={statusLoading || isPending}
      onToggleFavourite={handleFavourite}
      onProfile={() => router.push(`/${locale}/lawyers/${lawyer.id}`)}
    />
  );
}
