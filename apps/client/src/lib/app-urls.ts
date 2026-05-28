const LANDING = import.meta.env.VITE_LANDING_URL ?? '';
const LOCALE = 'en';

export const appUrls = {
  search: `${LANDING}/${LOCALE}/search`,
  profile: (lawyerId: string) => `${LANDING}/${LOCALE}/lawyers/${lawyerId}`,
  book: (lawyerId: string) => `${LANDING}/${LOCALE}/book/${lawyerId}`,
} as const;
