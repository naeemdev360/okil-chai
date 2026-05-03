const name = import.meta.env.VITE_APP_NAME ?? 'OkilChai';
const slug = import.meta.env.VITE_APP_SLUG ?? 'okilchai';

export const brand = {
  name,
  tagline: import.meta.env.VITE_APP_TAGLINE ?? 'Find a Lawyer. Book in Minutes.',
  storagePrefix: slug,
} as const;

export type Brand = typeof brand;
