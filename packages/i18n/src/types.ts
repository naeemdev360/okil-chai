import type commonEn from './locales/en/common.json';
import type authEn from './locales/en/auth.json';
import type bookingEn from './locales/en/booking.json';
import type lawyerEn from './locales/en/lawyer.json';

export type CommonTranslations = typeof commonEn;
export type AuthTranslations = typeof authEn;
export type BookingTranslations = typeof bookingEn;
export type LawyerTranslations = typeof lawyerEn;

export interface Translations {
  readonly common: CommonTranslations;
  readonly auth: AuthTranslations;
  readonly booking: BookingTranslations;
  readonly lawyer: LawyerTranslations;
}

export type Locale = 'en' | 'bn';

export const SUPPORTED_LOCALES = ['en', 'bn'] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = 'en';
