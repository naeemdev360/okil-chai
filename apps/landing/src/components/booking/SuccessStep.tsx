'use client';

import { useState } from 'react';
import { CheckCircle, Calendar, Download, Share2, X, ArrowRight } from 'lucide-react';
import { cn } from '@okil-chai/ui';
import { consultFee, computeFees, generateBookingRef } from './utils';
import { CancelModal } from './CancelModal';
import { ConfirmationCard } from './ConfirmationCard';
import { ConfirmationSidebar } from './ConfirmationSidebar';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { ConsultType } from './types';

export interface SuccessStepProps {
  readonly lawyer: Lawyer;
  readonly consultType: ConsultType;
  readonly selectedDay: string;
  readonly selectedTime: string;
  readonly locale: string;
}

export function SuccessStep({
  lawyer,
  consultType,
  selectedDay,
  selectedTime,
  locale,
}: SuccessStepProps) {
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const base = consultFee(lawyer, consultType);
  const fees = computeFees(base, false);
  const bookingRef = useState(() => generateBookingRef())[0];

  return (
    <div className="bg-cream min-h-screen pb-20">
      {showCancelModal && (
        <CancelModal
          lawyerName={lawyer.name}
          day={selectedDay}
          time={selectedTime}
          onConfirm={() => setShowCancelModal(false)}
          onDismiss={() => setShowCancelModal(false)}
        />
      )}

      {/* Success banner */}
      <div className="bg-success px-8 py-4">
        <div className="max-w-[1080px] mx-auto flex items-center gap-3">
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle className="size-4 text-white" aria-hidden />
          </div>
          <p className="font-sans text-sm text-white">
            <strong className="text-[15px]">Booking confirmed! </strong>
            Ref: {bookingRef} · A receipt has been sent to your email.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1080px] mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Left — main content + actions */}
        <div className="flex flex-col gap-5">
          <ConfirmationCard
            lawyer={lawyer}
            consultType={consultType}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            locale={locale}
          />

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="font-sans text-xs font-semibold tracking-[0.08em] uppercase text-gray-400 mb-3.5">
              Actions
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setAddedToCalendar(true)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-[1.5px] font-sans text-[13px] font-medium transition-all duration-150',
                  addedToCalendar
                    ? 'bg-success-bg border-success text-success'
                    : 'bg-cream border-gray-200 text-navy hover:border-navy',
                )}
              >
                <Calendar className="size-3.5" aria-hidden />
                {addedToCalendar ? 'Added to Calendar' : 'Add to Google Calendar'}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-[1.5px] border-gray-200 bg-cream font-sans text-[13px] font-medium text-navy hover:border-navy transition-colors"
              >
                <Download className="size-3.5" aria-hidden />
                Download Receipt
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-[1.5px] border-gray-200 bg-cream font-sans text-[13px] font-medium text-navy hover:border-navy transition-colors"
              >
                <Share2 className="size-3.5" aria-hidden />
                Share Details
              </button>
            </div>

            <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center gap-2.5">
              <a
                href={`/${locale}/search`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy text-white font-sans text-[13px] font-semibold hover:bg-navy-mid transition-colors"
              >
                <ArrowRight className="size-3.5" aria-hidden />
                Go to My Portal
              </a>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-[1.5px] border-gray-200 bg-transparent font-sans text-[13px] font-medium text-error hover:border-error/40 transition-colors"
              >
                <X className="size-3" aria-hidden />
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Right — details sidebar */}
        <ConfirmationSidebar
          lawyer={lawyer}
          bookingRef={bookingRef}
          fees={fees}
          locale={locale}
        />
      </div>
    </div>
  );
}
