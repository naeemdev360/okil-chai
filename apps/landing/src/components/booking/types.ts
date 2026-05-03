import type { LucideIcon } from 'lucide-react';

export type BookingStep = 'time' | 'details' | 'payment' | 'confirmation';

export type ConsultType = 'video' | 'phone' | 'in-person';

export interface ConsultOption {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly desc: string;
}

export type ConsultMeta = Record<ConsultType, ConsultOption>;

export interface BookingDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly caseDescription: string;
}
