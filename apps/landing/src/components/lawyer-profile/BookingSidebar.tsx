'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Lock, Phone, Video } from 'lucide-react';
import { Button, SurfaceCard } from '@repo/ui';
import type { Lawyer } from '../../lib/search/mock-lawyers';

interface BookingSidebarProps {
  readonly lawyer: Lawyer;
}

const CONSULT_OPTIONS = [
  { icon: Video, label: 'Video Call',  priceDelta: 0  },
  { icon: Phone, label: 'Phone Call',  priceDelta: -20 },
] as const;

export function BookingSidebar({ lawyer }: BookingSidebarProps) {
  const locale = useLocale();

  return (
    <SurfaceCard className="sticky top-[88px]">
      <p className="font-heading text-lg font-semibold text-navy mb-1">Book a Consultation</p>
      <p className="font-sans text-sm text-gray-600 mb-5">
        No commitment. Cancel free up to 24 hours before.
      </p>

      <div className="flex flex-col gap-2.5 mb-5">
        {CONSULT_OPTIONS.map(({ icon: Icon, label, priceDelta }) => (
          <div key={label} className="flex items-center justify-between px-3.5 py-3 border border-gray-200 rounded-lg">
            <span className="flex items-center gap-2 font-sans text-sm text-gray-800">
              <Icon className="size-4 text-gray-400" aria-hidden />
              {label}
            </span>
            <span className="font-sans text-sm font-medium text-navy">
              from ${lawyer.pricePerHour + priceDelta}/hr
            </span>
          </div>
        ))}
      </div>

      <Button variant="gold" size="lg" className="w-full justify-center" asChild>
        <Link href={`/${locale}/book/${lawyer.id}`}>Book Now</Link>
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        <Lock className="size-3.5 text-gray-400" aria-hidden />
        <span className="font-sans text-xs text-gray-400">Secure payment. Encrypted & private.</span>
      </div>
    </SurfaceCard>
  );
}
