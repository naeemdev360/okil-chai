import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { StarRating } from '@okil-chai/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import { CONSULT_META } from './constants';
import { consultFee } from './utils';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { ConsultType } from './types';

interface LawyerSummaryCardProps {
  readonly lawyer: Lawyer;
  readonly selectedDay: string | null;
  readonly selectedTime: string | null;
  readonly consultType: ConsultType | null;
}


export function LawyerSummaryCard({
  lawyer,
  selectedDay,
  selectedTime,
  consultType,
}: LawyerSummaryCardProps) {
  const fee = consultType ? consultFee(lawyer, consultType) : lawyer.pricePerHour;
  const platformFee = Math.round(fee * 0.05);
  const total = fee + platformFee;

  const ConsultIcon = consultType ? CONSULT_META[consultType].icon : null;
  const consultLabel = consultType ? CONSULT_META[consultType].label : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-[88px]">
      {/* Header label */}
      <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gold mb-3.5">
        Booking Summary
      </p>

      {/* Lawyer info */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-3.5">
        <LawyerAvatar initials={lawyer.initials} verified={lawyer.verified} size="md" />
        <div className="min-w-0">
          <h2 className="font-heading text-[15px] font-semibold text-navy leading-tight truncate">
            {lawyer.name}
          </h2>
          <p className="font-sans text-xs tracking-[0.06em] uppercase text-gold font-medium mt-0.5">
            {lawyer.specialization}
          </p>
          <StarRating variant="row" size="xs" rating={lawyer.rating} count={lawyer.reviewCount} className="mt-0.5" />
        </div>
      </div>

      {/* Selected details */}
      <div className="flex flex-col gap-2 mb-4">
        {selectedDay && (
          <div className="flex items-center gap-2.5 font-sans text-[13px] text-gray-800">
            <Calendar className="size-3.5 text-gold shrink-0" aria-hidden />
            <span>{selectedDay}</span>
          </div>
        )}
        {selectedTime && (
          <div className="flex items-center gap-2.5 font-sans text-[13px] text-gray-800">
            <Clock className="size-3.5 text-gold shrink-0" aria-hidden />
            <span>{selectedTime} · 60 min</span>
          </div>
        )}
        {ConsultIcon && consultLabel && (
          <div className="flex items-center gap-2.5 font-sans text-[13px] text-gray-800">
            <ConsultIcon className="size-3.5 text-gold shrink-0" aria-hidden />
            <span>{consultLabel}</span>
          </div>
        )}
      </div>

      {/* Fee breakdown */}
      <div className="border-t border-gray-100 pt-3.5 flex flex-col gap-1.5">
        <div className="flex justify-between font-sans text-[13px] text-gray-600">
          <span>Consultation fee</span>
          <span>${fee}.00</span>
        </div>
        <div className="flex justify-between font-sans text-[13px] text-gray-600">
          <span>Platform fee (5%)</span>
          <span>${platformFee}.00</span>
        </div>
        <div className="flex justify-between font-sans text-sm font-bold text-navy border-t border-gray-100 pt-2.5 mt-1">
          <span>Total</span>
          <span>${total}.00</span>
        </div>
      </div>

      {/* Cancellation notice */}
      <div className="mt-3.5 flex items-center gap-1.5 px-3 py-2.5 bg-success-bg rounded-lg">
        <CheckCircle className="size-3 text-success shrink-0" aria-hidden />
        <span className="font-sans text-[11px] text-success font-medium">
          Free cancellation up to 24h before
        </span>
      </div>
    </div>
  );
}
