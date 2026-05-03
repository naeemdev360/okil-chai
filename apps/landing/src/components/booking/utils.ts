import type { Lawyer } from '../../lib/search/mock-lawyers';
import { WEEK_DAYS, PLATFORM_FEE_RATE, TAX_RATE, PROMO_FIRST20_DISCOUNT } from './constants';
import type { ConsultType } from './types';

export function resolveInitialDay(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = WEEK_DAYS.find((d) => d.date === raw && d.available);
  return match ? raw : null;
}

export function consultFee(lawyer: Lawyer, type: ConsultType): number {
  return type === 'phone' ? lawyer.pricePerHour - 20 : lawyer.pricePerHour;
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

export function generateBookingRef(): string {
  return 'LC-2026-' + String(Math.floor(10000 + Math.random() * 90000));
}
