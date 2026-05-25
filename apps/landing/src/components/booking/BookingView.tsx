'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import type { AvailabilitySlot } from '@repo/shared';
import type { AppointmentWithPayment } from '@repo/api-client';
import { BookingPageHeader } from './BookingPageHeader';
import { DetailsStep } from './DetailsStep';
import { UserDetailsStep } from './UserDetailsStep';
import { LawyerSummaryCard } from './LawyerSummaryCard';
import { ReviewStep } from './ReviewStep';
import { SuccessStep } from './SuccessStep';
import { resolveInitialDay } from './utils';
import { useAuthStore } from '../../lib/store/auth.store';
import type { BookingDetails, BookingLawyerProfile, BookingStep, ConsultType } from './types';

export interface BookingViewProps {
  readonly lawyer: BookingLawyerProfile;
  readonly availabilitySlots: readonly AvailabilitySlot[];
  readonly initialDay?: string;
}

export function BookingView({ lawyer, availabilitySlots, initialDay }: BookingViewProps) {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAuthStore();

  const [step, setStep]             = useState<BookingStep>('time');
  const [consultType, setConsultType] = useState<ConsultType | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(
    resolveInitialDay(initialDay, availabilitySlots),
  );
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [userDetails, setUserDetails]   = useState<BookingDetails | null>(null);
  const [appointment, setAppointment]   = useState<AppointmentWithPayment | null>(null);

  function handleContinueFromTime() {
    if (!isAuthenticated) {
      const returnUrl = selectedDay ? `${pathname}?day=${selectedDay}` : pathname;
      router.push(`/${locale}/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setStep('details');
  }

  if (step === 'confirmation') {
    return (
      <SuccessStep
        lawyer={lawyer}
        consultType={consultType!}
        selectedDay={selectedDay!}
        selectedSlot={selectedSlot!}
        appointment={appointment}
        locale={locale}
      />
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <BookingPageHeader locale={locale} lawyer={lawyer} step={step} />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {(step === 'time' || step === 'details') && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <main>
              {step === 'time' && (
                <DetailsStep
                  lawyer={lawyer}
                  availabilitySlots={availabilitySlots}
                  consultType={consultType}
                  selectedDay={selectedDay}
                  selectedSlot={selectedSlot}
                  onConsultChange={setConsultType}
                  onDayChange={(d) => { setSelectedDay(d); setSelectedSlot(null); }}
                  onSlotChange={setSelectedSlot}
                  onContinue={handleContinueFromTime}
                />
              )}
              {step === 'details' && (
                <UserDetailsStep
                  onBack={() => setStep('time')}
                  onContinue={(details: BookingDetails) => {
                    setUserDetails(details);
                    setStep('payment');
                  }}
                />
              )}
            </main>
            <aside>
              <LawyerSummaryCard
                lawyer={lawyer}
                selectedDay={selectedDay}
                selectedSlot={selectedSlot}
                consultType={consultType}
              />
            </aside>
          </div>
        )}

        {step === 'payment' && (
          <ReviewStep
            lawyer={lawyer}
            consultType={consultType!}
            selectedDay={selectedDay!}
            selectedSlot={selectedSlot!}
            userDetails={userDetails!}
            onBack={() => setStep('details')}
            onSuccess={(appt: AppointmentWithPayment) => {
              setAppointment(appt);
              setStep('confirmation');
            }}
          />
        )}
      </div>
    </div>
  );
}
