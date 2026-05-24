'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Lock, Phone, Video, Building2 } from 'lucide-react';
import { Button, SurfaceCard } from '@repo/ui';
import type { LawyerPublicProfileResponse } from '@repo/shared';
import { ConsultationType } from '@repo/shared';

interface BookingSidebarProps {
  readonly lawyer: LawyerPublicProfileResponse;
}

const CONSULT_META: Record<ConsultationType, { icon: React.ElementType; label: string }> = {
  [ConsultationType.VIDEO]:     { icon: Video,     label: 'Video Call'  },
  [ConsultationType.PHONE]:     { icon: Phone,     label: 'Phone Call'  },
  [ConsultationType.IN_PERSON]: { icon: Building2, label: 'In-Person'   },
};

export function BookingSidebar({ lawyer }: BookingSidebarProps) {
  const locale = useLocale();
  const price = parseFloat(lawyer.pricePerHour ?? '0');

  return (
    <SurfaceCard className="sticky top-[88px]">
      <p className="font-heading text-lg font-semibold text-navy mb-1">Book a Consultation</p>
      <p className="font-sans text-sm text-gray-600 mb-5">
        No commitment. Cancel free up to 24 hours before.
      </p>

      {lawyer.consultationTypes.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-5">
          {lawyer.consultationTypes.map((type) => {
            const { icon: Icon, label } = CONSULT_META[type];
            return (
              <div key={type} className="flex items-center justify-between px-3.5 py-3 border border-gray-200 rounded-lg">
                <span className="flex items-center gap-2 font-sans text-sm text-gray-800">
                  <Icon className="size-4 text-gray-400" aria-hidden />
                  {label}
                </span>
                {price > 0 && (
                  <span className="font-sans text-sm font-medium text-navy">
                    from ৳{price}/hr
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

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
