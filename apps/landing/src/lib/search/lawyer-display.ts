import { ConsultationType } from '@repo/shared';
import type { LawyerPublicProfileResponse } from '@repo/shared';

export type ConsultTypeUI = 'video' | 'phone' | 'in-person';
export type BadgeUI = 'topRated' | 'pro' | 'new' | null;

export interface LawyerDisplay {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly primarySpecialization: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly totalConsultations: number;
  readonly pricePerHour: number;
  readonly city: string;
  readonly verified: boolean;
  readonly consultTypes: ReadonlyArray<ConsultTypeUI>;
  readonly badge: BadgeUI;
  readonly bio: string;
  readonly availableToday: boolean;
  readonly photoUrl: string | null;
  readonly yearsOfExperience: number | null;
  readonly languages: ReadonlyArray<string>;
}

const CONSULT_MAP: Record<ConsultationType, ConsultTypeUI> = {
  [ConsultationType.VIDEO]:     'video',
  [ConsultationType.PHONE]:     'phone',
  [ConsultationType.IN_PERSON]: 'in-person',
};

function deriveBadge(rating: number, reviewCount: number): BadgeUI {
  if (rating >= 4.8 && reviewCount >= 30) return 'topRated';
  if (reviewCount >= 15 && rating >= 4.5) return 'pro';
  if (reviewCount === 0) return 'new';
  return null;
}

export function toLawyerDisplay(lawyer: LawyerPublicProfileResponse): LawyerDisplay {
  const rating = parseFloat(lawyer.avgRating ?? '0');
  const primarySpec =
    lawyer.specializations.find((s) => s.isPrimary) ?? lawyer.specializations[0];

  return {
    id: lawyer.id,
    initials: `${lawyer.firstName.charAt(0)}${lawyer.lastName.charAt(0)}`.toUpperCase(),
    name: `${lawyer.firstName} ${lawyer.lastName}`,
    primarySpecialization: primarySpec?.name ?? '',
    rating,
    reviewCount: lawyer.totalReviews,
    totalConsultations: lawyer.totalConsultations,
    pricePerHour: parseFloat(lawyer.pricePerHour ?? '0'),
    city: lawyer.city ?? '',
    verified: true,
    consultTypes: lawyer.consultationTypes.map((ct) => CONSULT_MAP[ct]),
    badge: deriveBadge(rating, lawyer.totalReviews),
    bio: lawyer.bio ?? '',
    availableToday: lawyer.isInstantBooking,
    photoUrl: lawyer.photoUrl,
    yearsOfExperience: lawyer.yearsOfExperience ?? null,
    languages: lawyer.languages,
  };
}
