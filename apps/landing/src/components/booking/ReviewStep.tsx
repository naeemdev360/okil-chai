'use client';

import type { AppointmentWithPayment } from '@repo/api-client';
import { isApiError } from '@repo/api-client';
import { useCreateAppointment } from '@repo/hooks';
import type { AvailabilitySlot } from '@repo/shared';
import { cn, toast } from '@repo/ui';
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import { CONSULT_META } from './constants';
import type { BookingDetails, BookingLawyerProfile, ConsultType } from './types';
import {
  buildAppointmentTimes,
  computeFees,
  consultFee,
  formatDateLabel,
  formatTime,
  toConsultationType,
} from './utils';

export interface ReviewStepProps {
  readonly lawyer:       BookingLawyerProfile;
  readonly consultType:  ConsultType;
  readonly selectedDay:  string;
  readonly selectedSlot: AvailabilitySlot;
  readonly userDetails:  BookingDetails;
  readonly onBack:       () => void;
  readonly onSuccess:    (appointment: AppointmentWithPayment) => void;
}

interface FeeRowProps {
  label:      string;
  value:      string;
  highlight?: 'success' | 'navy';
}

function FeeRow({ label, value, highlight }: FeeRowProps) {
  return (
    <div
      className={cn(
        'flex justify-between font-sans text-[13px]',
        highlight === 'success' && 'text-success',
        highlight === 'navy'    && 'text-navy font-semibold',
        !highlight              && 'text-gray-600',
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ProcessingOverlay() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="size-14 border-4 border-gray-100 border-t-gold rounded-full mx-auto mb-5 animate-spin" />
        <h2 className="font-heading text-xl font-semibold text-navy mb-1.5">
          Processing your booking…
        </h2>
        <p className="font-sans text-sm text-gray-600">
          Please don&apos;t refresh. This takes a few seconds.
        </p>
      </div>
    </div>
  );
}

export function ReviewStep({
  lawyer,
  consultType,
  selectedDay,
  selectedSlot,
  userDetails,
  onBack,
  onSuccess,
}: ReviewStepProps) {
  const [promoCode, setPromoCode]       = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const { mutate: createAppointment, isPending, error: mutationError } = useCreateAppointment();

  const base        = consultFee(lawyer, consultType);
  const fees        = computeFees(base, promoApplied);
  const platformPct = Math.round((fees.platform / fees.base) * 100);
  const { label: consultLabel } = CONSULT_META[consultType];

  // const errorMessage = mutationError
  //   ? (isApiError(mutationError) ? mutationError.message : 'Something went wrong. Please try again.')
  //   : null;

  function applyPromo() {
    setPromoApplied(promoCode.trim().toUpperCase() === 'FIRST20');
  }

  function handleConfirm() {
    const { startAt, endAt } = buildAppointmentTimes(selectedSlot);

    createAppointment(
      {
        lawyerId:         lawyer.id,
        consultationType: toConsultationType(consultType),
        caseCategory:     userDetails.caseCategory,
        startAt,
        endAt,
        clientNotes:      userDetails.caseDescription || undefined,
      },
      {
        onSuccess: (appointment) => {
          if (appointment.redirectUrl) {
            window.location.href = appointment.redirectUrl;
            return;
          }
          onSuccess(appointment);
        },
        onError: (error) => {
          const message =isApiError(error)? error.message : 'Something went wrong. Please try again.';
          toast.error(message);
        },
      },
    );
  }

  if (isPending) return <ProcessingOverlay />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-7">
      {/* ── LEFT: review details ── */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-gray-600 hover:text-navy transition-colors w-fit"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading text-[22px] font-semibold text-navy mb-5">
            Review Your Booking
          </h2>

          {/* Lawyer + slot summary */}
          <div className="flex items-start gap-4 pb-5 border-b border-gray-100 mb-5">
            <LawyerAvatar
              initials={lawyer.initials}
              verified
              photoUrl={lawyer.photoUrl}
              size="md"
            />
            <div>
              <p className="font-heading text-base font-semibold text-navy">{lawyer.fullName}</p>
              <p className="font-sans text-xs text-gold tracking-wider uppercase">
                {lawyer.primarySpecialization}
              </p>
              <p className="font-sans text-[13px] text-gray-600 mt-1.5">
                {formatDateLabel(selectedDay)} · {formatTime(selectedSlot.startTime)} –{' '}
                {formatTime(selectedSlot.endTime)}
              </p>
              <p className="font-sans text-[13px] text-gray-600">{consultLabel}</p>
            </div>
          </div>

          {/* Your details */}
          <div className="pb-5 border-b border-gray-100 mb-5">
            <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 mb-2.5">
              Your Details
            </p>
            {[
              ['Name',  `${userDetails.firstName} ${userDetails.lastName}`],
              ['Email', userDetails.email],
              ['Phone', userDetails.phone],
            ].map(([key, value]) => (
              <div key={key} className="flex justify-between font-sans text-[13px] mb-1.5">
                <span className="text-gray-500">{key}</span>
                <span className="text-navy font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Payment method notice */}
          <div className="p-4 bg-gold-pale rounded-xl border border-gold/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="size-3.5 text-gold" aria-hidden />
              <p className="font-sans text-[13px] font-semibold text-navy">
                Secure Payment via bKash
              </p>
            </div>
            <p className="font-sans text-xs text-gray-600 leading-relaxed">
              After confirming, you will be redirected to bKash to complete payment.
              Your appointment is confirmed once payment is verified.
            </p>
          </div>
{/* 
          {errorMessage && (
            <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-error/5 rounded-lg border border-error/20">
              <AlertCircle className="size-4 text-error mt-0.5 shrink-0" aria-hidden />
              <p className="font-sans text-xs text-error">{errorMessage}</p>
            </div>
          )} */}
        </div>

        {/* Promo code */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Promo code (try FIRST20)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 font-sans text-sm text-navy focus:border-navy focus:outline-none"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="px-4 py-2.5 rounded-lg font-sans text-sm font-semibold bg-navy text-white hover:bg-navy-mid transition-colors shrink-0"
          >
            Apply
          </button>
        </div>

        {promoApplied && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-success-bg rounded-lg font-sans text-xs text-success">
            <CheckCircle className="size-3.5 shrink-0" aria-hidden />
            FIRST20 applied — ৳20 off your first consultation!
          </div>
        )}
      </div>

      {/* ── RIGHT: order summary + confirm ── */}
      <div className="sticky top-[88px] self-start flex flex-col gap-3.5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 mb-4">
            Order Summary
          </p>

          <div className="flex flex-col gap-2 mb-3">
            <FeeRow label="Consultation fee"                   value={`৳${fees.base}`}     />
            <FeeRow label={`Platform fee (${platformPct}%)`}  value={`৳${fees.platform}`} />
            <FeeRow label="Tax"                                value={`৳${fees.tax}`}      />
            {promoApplied && (
              <FeeRow label="Promo (FIRST20)" value={`−৳${fees.discount}`} highlight="success" />
            )}
          </div>

          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-baseline">
            <span className="font-sans text-sm font-semibold text-navy">Total</span>
            <span className="font-heading text-2xl font-bold text-navy">৳{fees.total}</span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full mt-4 py-3.5 rounded-lg bg-gold text-navy font-sans text-[15px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-gold-light transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="size-3.5" aria-hidden />
            Confirm &amp; Pay ৳{fees.total}
          </button>

          <p className="mt-3 p-2.5 bg-cream rounded-lg font-sans text-[11px] text-gray-600 leading-relaxed">
            <strong className="text-navy">Free cancellation</strong> up to 24 hours before. Full
            refund guaranteed for no-shows.
          </p>
        </div>
      </div>
    </div>
  );
}
