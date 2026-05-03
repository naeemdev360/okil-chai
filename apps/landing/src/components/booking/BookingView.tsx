'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { BookingPageHeader } from './BookingPageHeader';
import { DetailsStep } from './DetailsStep';
import { UserDetailsStep } from './UserDetailsStep';
import { LawyerSummaryCard } from './LawyerSummaryCard';
import { ReviewStep } from './ReviewStep';
import { SuccessStep } from './SuccessStep';
import { resolveInitialDay } from './utils';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { BookingStep, ConsultType } from './types';

export interface BookingViewProps {
  readonly lawyer: Lawyer;
  readonly initialDay?: string;
  readonly initialTime?: string;
}

export function BookingView({ lawyer, initialDay, initialTime }: BookingViewProps) {
  const locale = useLocale();

  const [step, setStep] = useState<BookingStep>('time');
  const [consultType, setConsultType] = useState<ConsultType | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(resolveInitialDay(initialDay));
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime ?? null);

  if (step === 'confirmation') {
    return (
      <SuccessStep
        lawyer={lawyer}
        consultType={consultType!}
        selectedDay={selectedDay!}
        selectedTime={selectedTime!}
        locale={locale}
      />
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <BookingPageHeader locale={locale} lawyer={lawyer} step={step} />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Steps 1 & 2: main content left, booking sidebar right */}
        {(step === 'time' || step === 'details') && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <main>
              {step === 'time' && (
                <DetailsStep
                  lawyer={lawyer}
                  consultType={consultType}
                  selectedDay={selectedDay}
                  selectedTime={selectedTime}
                  onConsultChange={setConsultType}
                  onDayChange={(d) => { setSelectedDay(d); setSelectedTime(null); }}
                  onTimeChange={setSelectedTime}
                  onContinue={() => setStep('details')}
                />
              )}
              {step === 'details' && (
                <UserDetailsStep
                  onBack={() => setStep('time')}
                  onContinue={() => setStep('payment')}
                />
              )}
            </main>
            <aside>
              <LawyerSummaryCard
                lawyer={lawyer}
                selectedDay={selectedDay}
                selectedTime={selectedTime}
                consultType={consultType}
              />
            </aside>
          </div>
        )}

        {/* Step 3: payment manages its own two-column layout */}
        {step === 'payment' && (
          <ReviewStep
            lawyer={lawyer}
            consultType={consultType!}
            selectedDay={selectedDay!}
            selectedTime={selectedTime!}
            onBack={() => setStep('details')}
            onSuccess={() => setStep('confirmation')}
          />
        )}
      </div>
    </div>
  );
}
