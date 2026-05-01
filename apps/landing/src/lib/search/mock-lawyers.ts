export interface Lawyer {
  readonly id: number;
  readonly initials: string;
  readonly name: string;
  readonly specialization: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly pricePerHour: number;
  readonly city: string;
  readonly verified: boolean;
  readonly consultTypes: ReadonlyArray<'video' | 'phone' | 'in-person'>;
  readonly badge: 'topRated' | 'pro' | 'new' | null;
  readonly bio: string;
  readonly availableToday: boolean;
}

export const MOCK_LAWYERS: readonly Lawyer[] = [
  {
    id: 1, initials: 'JS', name: 'James Sullivan', specialization: 'Criminal Law',
    rating: 4.9, reviewCount: 142, pricePerHour: 180, city: 'New York',
    verified: true, consultTypes: ['video', 'phone'], badge: 'topRated',
    bio: '15 years experience in federal and state criminal defense.',
    availableToday: true,
  },
  {
    id: 2, initials: 'AP', name: 'Amara Patel', specialization: 'Family Law',
    rating: 4.8, reviewCount: 98, pricePerHour: 150, city: 'Los Angeles',
    verified: true, consultTypes: ['video', 'in-person'], badge: 'pro',
    bio: 'Specializing in divorce, custody, and child support cases.',
    availableToday: false,
  },
  {
    id: 3, initials: 'ML', name: 'Marcus Liu', specialization: 'Corporate Law',
    rating: 4.7, reviewCount: 210, pricePerHour: 220, city: 'Chicago',
    verified: true, consultTypes: ['video', 'phone', 'in-person'], badge: null,
    bio: 'M&A, contracts, and startup legal counsel.',
    availableToday: true,
  },
  {
    id: 4, initials: 'SR', name: 'Sofia Rivera', specialization: 'Immigration',
    rating: 4.9, reviewCount: 176, pricePerHour: 130, city: 'Miami',
    verified: true, consultTypes: ['video', 'phone'], badge: 'topRated',
    bio: 'Visa applications, green cards, and asylum cases.',
    availableToday: true,
  },
  {
    id: 5, initials: 'TK', name: 'Thomas Kim', specialization: 'Real Estate',
    rating: 4.6, reviewCount: 63, pricePerHour: 160, city: 'Seattle',
    verified: true, consultTypes: ['in-person'], badge: 'new',
    bio: 'Property transactions, leases, and zoning disputes.',
    availableToday: false,
  },
  {
    id: 6, initials: 'EN', name: 'Elena Novak', specialization: 'Employment Law',
    rating: 4.8, reviewCount: 89, pricePerHour: 145, city: 'Boston',
    verified: true, consultTypes: ['video', 'phone'], badge: 'pro',
    bio: 'Wrongful termination, discrimination, and workplace harassment.',
    availableToday: true,
  },
];
