import type { MatcherLawyer, UrgencyKey, BudgetKey } from './types';

export const MATCHER_LAWYERS: readonly MatcherLawyer[] = [
  { id: 1, initials: 'JS', name: 'James Sullivan', specialization: 'Criminal Law',   rating: 4.9, reviewCount: 142, pricePerHour: 180, city: 'New York', languages: ['English'] },
  { id: 2, initials: 'AP', name: 'Amara Patel',    specialization: 'Family Law',     rating: 4.8, reviewCount: 98,  pricePerHour: 150, city: 'Dhaka',   languages: ['English', 'Bengali'] },
  { id: 3, initials: 'ML', name: 'Marcus Liu',     specialization: 'Corporate Law',  rating: 4.7, reviewCount: 210, pricePerHour: 220, city: 'Chicago', languages: ['English'] },
  { id: 4, initials: 'SR', name: 'Sofia Rivera',   specialization: 'Immigration',    rating: 4.9, reviewCount: 176, pricePerHour: 130, city: 'Dhaka',   languages: ['English', 'Bengali'] },
  { id: 5, initials: 'TK', name: 'Thomas Kim',     specialization: 'Real Estate',    rating: 4.6, reviewCount: 63,  pricePerHour: 160, city: 'Seattle', languages: ['English'] },
  { id: 6, initials: 'EN', name: 'Elena Novak',    specialization: 'Employment Law', rating: 4.8, reviewCount: 89,  pricePerHour: 145, city: 'Boston',  languages: ['English'] },
] as const;

export const SAMPLE_KEYS        = ['landlord', 'business', 'dui', 'visa'] as const;
export const URGENCY_KEYS: readonly UrgencyKey[] = ['today', 'thisWeek', 'noRush'];
export const BUDGET_KEYS:  readonly BudgetKey[]  = ['low', 'mid', 'any'];
export const ANALYZING_STEP_KEYS = ['identifying', 'matching', 'filtering', 'ranking'] as const;

export const MIN_DESCRIPTION_LENGTH = 20;
export const ANALYSIS_DELAY_MS      = 3000;
