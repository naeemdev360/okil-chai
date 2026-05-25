import type { AvailabilitySlot, LawyerPublicProfileResponse } from '@repo/shared';
import { ConsultationType } from '@repo/shared';
import { PLATFORM_FEE_RATE, TAX_RATE, PROMO_FIRST20_DISCOUNT } from './constants';
import type { BookingLawyerProfile, ConsultType } from './types';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function fromPublicProfile(profile: LawyerPublicProfileResponse): BookingLawyerProfile {
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  const primary = profile.specializations.find((s) => s.isPrimary) ?? profile.specializations[0];

  const consultTypes: ConsultType[] = profile.consultationTypes.flatMap((t) => {
    if (t === ConsultationType.VIDEO)     return ['video' as const];
    if (t === ConsultationType.PHONE)     return ['phone' as const];
    if (t === ConsultationType.IN_PERSON) return ['in-person' as const];
    return [];
  });

  return {
    id: profile.id,
    initials,
    fullName: `${profile.firstName} ${profile.lastName}`,
    primarySpecialization: primary?.name ?? 'Legal Services',
    photoUrl: profile.photoUrl,
    rating: profile.avgRating ? parseFloat(profile.avgRating) : null,
    reviewCount: profile.totalReviews,
    pricePerHour: profile.pricePerHour ? parseFloat(profile.pricePerHour) : 0,
    city: profile.city,
    consultTypes,
    bio: profile.bio,
  };
}

export function toConsultationType(type: ConsultType): ConsultationType {
  if (type === 'video')     return ConsultationType.VIDEO;
  if (type === 'phone')     return ConsultationType.PHONE;
  return ConsultationType.IN_PERSON;
}

/** Group availability slots by ISO date string (YYYY-MM-DD). */
export function groupSlotsByDate(
  slots: readonly AvailabilitySlot[],
): Map<string, AvailabilitySlot[]> {
  const map = new Map<string, AvailabilitySlot[]>();
  for (const slot of slots) {
    const existing = map.get(slot.date) ?? [];
    existing.push(slot);
    map.set(slot.date, existing);
  }
  return map;
}

function parseDateParts(date: string): [number, number, number] {
  const parts = date.split('-');
  return [
    parseInt(parts[0] ?? '0', 10),
    parseInt(parts[1] ?? '1', 10),
    parseInt(parts[2] ?? '1', 10),
  ];
}

/** Format YYYY-MM-DD to a short label like "May 27". */
export function formatDateLabel(date: string): string {
  const [year, month, day] = parseDateParts(date);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Get 3-letter weekday name for a YYYY-MM-DD string. */
export function getWeekdayLabel(date: string): string {
  const [year, month, day] = parseDateParts(date);
  const dow = new Date(year, month - 1, day).getDay();
  return WEEKDAY_LABELS[dow] ?? 'Sun';
}

/** Format "09:00" or "09:00:00" → "9:00 AM" display string. */
export function formatTime(time: string): string {
  const parts   = time.split(':');
  const hours   = parseInt(parts[0] ?? '0', 10);
  const minutes = parts[1] ?? '00';
  const period  = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes} ${period}`;
}

/**
 * Build ISO 8601 datetime strings for the API from a date + slot.
 * Uses UTC+6 (Bangladesh Standard Time).
 */
export function buildAppointmentTimes(slot: AvailabilitySlot): {
  startAt: string;
  endAt: string;
} {
  const tz = '+06:00';
  return {
    startAt: `${slot.date}T${normalizeTime(slot.startTime)}${tz}`,
    endAt:   `${slot.date}T${normalizeTime(slot.endTime)}${tz}`,
  };
}

function normalizeTime(t: string): string {
  const parts = t.split(':');
  const hh = (parts[0] ?? '00').padStart(2, '0');
  const mm = parts[1] ?? '00';
  const ss = parts[2] ?? '00';
  return `${hh}:${mm}:${ss}`;
}

/** Find the initial slot based on a pre-selected date string (YYYY-MM-DD). */
export function resolveInitialDay(
  raw: string | undefined,
  slots: readonly AvailabilitySlot[],
): string | null {
  if (!raw) return null;
  return slots.some((s) => s.date === raw) ? raw : null;
}

export function consultFee(lawyer: BookingLawyerProfile, type: ConsultType): number {
  return type === 'phone' ? Math.max(0, lawyer.pricePerHour - 20) : lawyer.pricePerHour;
}

export interface FeeBreakdown {
  readonly base: number;
  readonly platform: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
}

export function computeFees(base: number, promoApplied: boolean): FeeBreakdown {
  const platform = Math.round(base * PLATFORM_FEE_RATE);
  const tax = Math.round((base + platform) * TAX_RATE);
  const discount = promoApplied ? PROMO_FIRST20_DISCOUNT : 0;
  return { base, platform, tax, discount, total: base + platform + tax - discount };
}
