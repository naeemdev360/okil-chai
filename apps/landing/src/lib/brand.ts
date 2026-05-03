const name = process.env.NEXT_PUBLIC_APP_NAME ?? 'OkilChai';
const slug = process.env.NEXT_PUBLIC_APP_SLUG ?? 'okilchai';

export const brand = {
  name,
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE ?? 'Find a Lawyer. Book in Minutes.',
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'okilchai.com',
  legalDisclaimer:
    process.env.NEXT_PUBLIC_APP_LEGAL_DISCLAIMER ??
    `${name} is not a law firm and does not provide legal advice. Connecting a client with a lawyer through our platform does not constitute an attorney-client relationship. Lawyer profiles are independently verified. Use of this site is subject to our Terms of Service.`,
  storagePrefix: slug,
} as const;

export type Brand = typeof brand;
