export const ALL_STEP_KEYS = [
  'account',
  'personal',
  'credentials',
  'specs',
  'pricing',
  'availability',
  'photo',
] as const;

export type StepKey = typeof ALL_STEP_KEYS[number];

// Authenticated lawyers skip the account step
export const AUTH_STEP_KEYS = ALL_STEP_KEYS.slice(1);
