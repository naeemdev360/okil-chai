import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@repo/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { FeeBreakdown } from './utils';

interface ConfirmationSidebarProps {
  readonly lawyer: Lawyer;
  readonly bookingRef: string;
  readonly fees: FeeBreakdown;
  readonly locale: string;
}

const DETAIL_STYLE = {
  success: 'text-success',
  mono:    'font-mono text-xs text-navy',
  navy:    'text-navy',
} as const;

export function ConfirmationSidebar({
  lawyer,
  bookingRef,
  fees,
  locale,
}: ConfirmationSidebarProps) {
  const details: ReadonlyArray<[string, string, keyof typeof DETAIL_STYLE]> = [
    ['Booking Ref',    bookingRef,                    'mono'   ],
    ['Status',         '✓ Confirmed',                 'success'],
    ['Payment',        `$${fees.total} charged`,      'navy'   ],
    ['Card',           'Visa •••• 4242',              'navy'   ],
    ['Cancellation',   'Free until 24h before',       'navy'   ],
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Booking details */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 mb-3.5">
          Booking Details
        </p>
        {details.map(([key, value, style]) => (
          <div key={key} className="flex justify-between font-sans text-[13px] mb-2">
            <span className="text-gray-600">{key}</span>
            <span className={cn('font-medium', DETAIL_STYLE[style])}>{value}</span>
          </div>
        ))}
      </div>

      {/* Book another */}
      <div className="bg-gold-pale rounded-xl p-5 border border-gold/30">
        <h4 className="font-heading text-[15px] font-semibold text-navy mb-1.5">
          Need another consultation?
        </h4>
        <p className="font-sans text-[13px] text-gray-800 leading-relaxed mb-3.5">
          Browse more lawyers or use AI Match to find the right specialist for any new matter.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/search`}
            className="w-full py-2.5 rounded-lg bg-navy text-white font-sans text-sm font-semibold text-center hover:bg-navy-mid transition-colors"
          >
            Browse Lawyers
          </Link>
          <Link
            href={`/${locale}/search`}
            className="w-full py-2.5 rounded-lg border border-gray-200 bg-white text-navy font-sans text-sm font-medium text-center hover:border-navy transition-colors"
          >
            ✦ Try AI Match
          </Link>
        </div>
      </div>

      {/* About your lawyer */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 mb-3">
          About Your Lawyer
        </p>
        <div className="flex items-center gap-2.5 mb-3">
          <LawyerAvatar initials={lawyer.initials} verified={lawyer.verified} size="md" />
          <div>
            <p className="font-heading text-sm font-semibold text-navy">{lawyer.name}</p>
            <span className="flex items-center gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    'size-3',
                    i <= Math.round(lawyer.rating)
                      ? 'fill-gold text-gold'
                      : 'fill-gray-200 text-gray-200',
                  )}
                  aria-hidden
                />
              ))}
              <span className="font-sans text-xs text-gray-400 ml-0.5">
                ({lawyer.reviewCount})
              </span>
            </span>
          </div>
        </div>
        <Link
          href={`/${locale}/lawyers/${lawyer.id}`}
          className="w-full block py-2.5 rounded-lg border border-gray-200 font-sans text-[13px] font-medium text-navy text-center hover:border-navy transition-colors"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
}
