import type { LucideIcon } from 'lucide-react';
import type { CaseCategory } from '@repo/shared';

export type BookingStep = 'time' | 'details' | 'payment' | 'confirmation';

export type ConsultType = 'video' | 'phone' | 'in-person';

export interface ConsultOption {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly desc: string;
}

export type ConsultMeta = Record<ConsultType, ConsultOption>;

export interface BookingLawyerProfile {
  readonly id: string;
  readonly initials: string;
  readonly fullName: string;
  readonly primarySpecialization: string;
  readonly photoUrl: string | null;
  readonly rating: number | null;
  readonly reviewCount: number;
  readonly pricePerHour: number;
  readonly city: string | null;
  readonly consultTypes: readonly ConsultType[];
  readonly bio: string | null;
}

export interface BookingDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly caseDescription: string;
  readonly caseCategory: CaseCategory;
}
