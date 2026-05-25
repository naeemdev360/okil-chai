'use client';

import { useMemo } from 'react';
import type { AvailabilitySlot } from '@repo/shared';
import { cn, TogglePill } from '@repo/ui';
import { CONSULT_META } from './constants';
import { consultFee, formatDateLabel, formatTime, getWeekdayLabel, groupSlotsByDate } from './utils';
import type { BookingLawyerProfile, ConsultType } from './types';

export interface DetailsStepProps {
  readonly lawyer: BookingLawyerProfile;
  readonly availabilitySlots: readonly AvailabilitySlot[];
  readonly consultType: ConsultType | null;
  readonly selectedDay: string | null;
  readonly selectedSlot: AvailabilitySlot | null;
  readonly onConsultChange: (type: ConsultType) => void;
  readonly onDayChange: (day: string) => void;
  readonly onSlotChange: (slot: AvailabilitySlot | null) => void;
  readonly onContinue: () => void;
}

export function DetailsStep({
  lawyer,
  availabilitySlots,
  consultType,
  selectedDay,
  selectedSlot,
  onConsultChange,
  onDayChange,
  onSlotChange,
  onContinue,
}: DetailsStepProps) {
  const slotsByDate = useMemo(() => groupSlotsByDate(availabilitySlots), [availabilitySlots]);
  const availableDates = useMemo(() => Array.from(slotsByDate.keys()).sort(), [slotsByDate]);
  const slotsForDay = useMemo(
    () => (selectedDay ? (slotsByDate.get(selectedDay) ?? []) : []),
    [slotsByDate, selectedDay],
  );

  const monthLabel = useMemo(() => {
    const first = availableDates[0];
    if (!first) return '';
    const parts = first.split('-');
    const year  = parseInt(parts[0] ?? '0', 10);
    const month = parseInt(parts[1] ?? '1', 10);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [availableDates]);

  const canContinue = consultType !== null && selectedDay !== null && selectedSlot !== null;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
        <h2 className="font-heading text-2xl font-semibold text-navy mb-1.5">Choose a Time</h2>
        <p className="font-sans text-sm text-gray-600 mb-7">
          Select your preferred consultation type, date and time slot.
        </p>

        {/* ── Consultation type ── */}
        <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-600 mb-2.5">
          Consultation Type
        </p>
        <div className="flex gap-2.5 mb-7">
          {(lawyer.consultTypes as ConsultType[]).map((type) => {
            const { icon: Icon, label, desc } = CONSULT_META[type];
            const active = consultType === type;
            return (
              <TogglePill
                key={type}
                variant="card"
                size="card"
                active={active}
                className="flex-1"
                onClick={() => onConsultChange(type)}
              >
                <Icon
                  className={cn('size-5 mb-1.5', active ? 'text-gold' : 'text-gray-400')}
                  aria-hidden
                />
                <span className="font-sans text-[13px]">{label}</span>
                <span className={cn('font-sans text-[11px] mt-0.5', active ? 'text-white/70' : 'text-gray-400')}>
                  {desc}
                </span>
                <span className={cn('font-sans text-[11px] mt-0.5', active ? 'text-gold/70' : 'text-gray-400')}>
                  ৳{consultFee(lawyer, type)}/hr
                </span>
              </TogglePill>
            );
          })}
        </div>

        {/* ── Date grid ── */}
        {availableDates.length === 0 ? (
          <p className="font-sans text-sm text-gray-500 py-4 text-center">
            No available slots in the next 30 days.
          </p>
        ) : (
          <>
            <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-600 mb-2.5">
              {monthLabel}
            </p>
            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {availableDates.map((date) => (
                <TogglePill
                  key={date}
                  variant="card"
                  size="card"
                  active={selectedDay === date}
                  className="py-2.5"
                  onClick={() => { onDayChange(date); onSlotChange(null); }}
                >
                  <span className="text-[9px] opacity-70 mb-0.5">{getWeekdayLabel(date)}</span>
                  <span className="font-semibold text-xs">{formatDateLabel(date)}</span>
                </TogglePill>
              ))}
            </div>
          </>
        )}

        {/* ── Time slots ── */}
        {selectedDay && slotsForDay.length > 0 && (
          <>
            <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-600 mb-2.5">
              Available Slots · {getWeekdayLabel(selectedDay)}, {formatDateLabel(selectedDay)}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {slotsForDay.map((slot) => (
                <TogglePill
                  key={`${slot.date}-${slot.startTime}`}
                  variant="default"
                  size="sm"
                  active={selectedSlot?.startTime === slot.startTime && selectedSlot?.date === slot.date}
                  className="w-full py-2.5 justify-center text-navy hover:border-navy"
                  onClick={() => onSlotChange(slot)}
                >
                  {formatTime(slot.startTime)}
                </TogglePill>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className={cn(
          'w-full py-3.5 rounded-lg font-sans text-[15px] font-semibold transition-all duration-150',
          canContinue
            ? 'bg-gold text-navy cursor-pointer hover:bg-gold-light'
            : 'bg-gold/40 text-navy/40 cursor-not-allowed',
        )}
      >
        Continue to Details →
      </button>
    </div>
  );
}
