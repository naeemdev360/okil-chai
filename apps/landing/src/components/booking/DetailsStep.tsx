'use client';

import { cn, TogglePill } from '@okil-chai/ui';
import { CONSULT_META, TIME_SLOTS, WEEK_DAYS } from './constants';
import { consultFee } from './utils';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { ConsultType } from './types';

export interface DetailsStepProps {
  readonly lawyer: Lawyer;
  readonly consultType: ConsultType | null;
  readonly selectedDay: string | null;
  readonly selectedTime: string | null;
  readonly onConsultChange: (type: ConsultType) => void;
  readonly onDayChange: (day: string) => void;
  readonly onTimeChange: (time: string | null) => void;
  readonly onContinue: () => void;
}

export function DetailsStep({
  lawyer,
  consultType,
  selectedDay,
  selectedTime,
  onConsultChange,
  onDayChange,
  onTimeChange,
  onContinue,
}: DetailsStepProps) {
  const canContinue = consultType !== null && selectedDay !== null && selectedTime !== null;

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
                  ${consultFee(lawyer, type)}/hr
                </span>
              </TogglePill>
            );
          })}
        </div>

        {/* ── Date grid — 7 cols × 14 days ── */}
        <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-600 mb-2.5">
          May 2026
        </p>
        <div className="grid grid-cols-7 gap-1.5 mb-6">
          {WEEK_DAYS.map((day) => (
            <TogglePill
              key={day.date}
              variant="card"
              size="card"
              active={selectedDay === day.date}
              disabled={!day.available}
              className="py-2.5"
              onClick={() => { onDayChange(day.date); onTimeChange(null); }}
            >
              <span className="text-[9px] opacity-70 mb-0.5">{day.label}</span>
              <span className="font-semibold text-xs">{day.date.split(' ')[1]}</span>
            </TogglePill>
          ))}
        </div>

        {/* ── Time slots — 5 cols, revealed after day is picked ── */}
        {selectedDay && (
          <>
            <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-600 mb-2.5">
              Available Slots · {WEEK_DAYS.find((d) => d.date === selectedDay)?.label},{' '}
              {selectedDay}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {TIME_SLOTS.map((time) => (
                <TogglePill
                  key={time}
                  variant="default"
                  size="sm"
                  active={selectedTime === time}
                  className="w-full py-2.5 justify-center text-navy hover:border-navy"
                  onClick={() => onTimeChange(time)}
                >
                  {time}
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
