import { Video, Phone, Building2 } from 'lucide-react';
import type { BookingStep, ConsultMeta } from './types';

export const PLATFORM_FEE_RATE = 0.05;  // 5% — charged on top of consultation fee
export const TAX_RATE          = 0.08;  // 8% applied on (base + platform)
export const PROMO_FIRST20_DISCOUNT = 20; // BDT/USD flat discount for FIRST20

export const WEEK_DAYS = [
  { label: 'Mon', date: 'May 4',  available: false },
  { label: 'Tue', date: 'May 5',  available: true  },
  { label: 'Wed', date: 'May 6',  available: true  },
  { label: 'Thu', date: 'May 7',  available: false },
  { label: 'Fri', date: 'May 8',  available: true  },
  { label: 'Sat', date: 'May 9',  available: false },
  { label: 'Sun', date: 'May 10', available: false },
  { label: 'Mon', date: 'May 11', available: true  },
  { label: 'Tue', date: 'May 12', available: true  },
  { label: 'Wed', date: 'May 13', available: true  },
  { label: 'Thu', date: 'May 14', available: false },
  { label: 'Fri', date: 'May 15', available: true  },
  { label: 'Sat', date: 'May 16', available: false },
  { label: 'Sun', date: 'May 17', available: false },
];

export const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '3:30 PM', '4:00 PM', '5:00 PM',
] as const;

export const CONSULT_META: ConsultMeta = {
  video:       { icon: Video,     label: 'Video Call', desc: 'Most popular' },
  phone:       { icon: Phone,     label: 'Phone Call', desc: 'Voice only'   },
  'in-person': { icon: Building2, label: 'In-Person',  desc: 'At office'   },
};

export const BOOKING_STEPS: ReadonlyArray<{ key: BookingStep; label: string }> = [
  { key: 'time',         label: 'Choose Time'  },
  { key: 'details',      label: 'Your Details' },
  { key: 'payment',      label: 'Payment'      },
  { key: 'confirmation', label: 'Confirmation' },
];
