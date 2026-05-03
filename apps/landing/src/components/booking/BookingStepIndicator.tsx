import { Fragment } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@okil-chai/ui';
import { BOOKING_STEPS } from './constants';
import type { BookingStep } from './types';

interface BookingStepIndicatorProps {
  readonly current: BookingStep;
}

export function BookingStepIndicator({ current }: BookingStepIndicatorProps) {
  const currentIdx = BOOKING_STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center mt-5">
      {BOOKING_STEPS.map((bookingStep, idx) => {
        const isDone   = idx < currentIdx;
        const isActive = idx === currentIdx;

        return (
          <Fragment key={bookingStep.key}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'size-8 rounded-full flex items-center justify-center font-sans text-sm font-semibold transition-all duration-150',
                  isDone   && 'bg-gold text-navy',
                  isActive && 'bg-white text-navy',
                  !isDone && !isActive && 'bg-white/20 text-white/60',
                )}
              >
                {isDone ? <Check className="size-4" aria-hidden /> : <span>{idx + 1}</span>}
              </div>
              <span
                className={cn(
                  'font-sans text-[11px] mt-1.5 whitespace-nowrap',
                  isActive ? 'text-white font-semibold' : 'text-white/60',
                )}
              >
                {bookingStep.label}
              </span>
            </div>
            {idx < BOOKING_STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px mx-2 mb-4 transition-all duration-150',
                  isDone ? 'bg-gold/60' : 'bg-white/20',
                )}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
