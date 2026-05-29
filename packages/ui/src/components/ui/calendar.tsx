'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../../utils/cn';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const NAV_BUTTON = cn(
  'inline-flex size-7 items-center justify-center rounded-md text-gray-500',
  'hover:bg-gray-100 hover:text-navy disabled:pointer-events-none disabled:opacity-30',
  'transition-colors duration-150',
);

const DAY_BUTTON = cn(
  'inline-flex size-9 items-center justify-center rounded-md p-0 font-sans text-sm font-normal text-gray-800',
  'hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20',
);

/**
 * Themed wrapper around react-day-picker, styled with OkilChai tokens (navy
 * selection, gold "today" ring). Tuned for `mode="range"` — pair it with
 * `DateRangePicker`. Single-select callers should pass their own
 * `classNames.selected` since range styling lives on the range_* modifiers.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-1', className)}
      classNames={{
        months: 'relative flex flex-col gap-4 sm:flex-row',
        month: 'flex flex-col gap-3',
        nav: 'absolute inset-x-0 top-0 z-10 flex items-center justify-between px-1',
        button_previous: NAV_BUTTON,
        button_next: NAV_BUTTON,
        month_caption: 'flex h-7 items-center justify-center',
        caption_label: 'font-sans text-sm font-semibold text-navy',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'w-9 font-sans text-[0.7rem] font-medium uppercase tracking-wide text-gray-400',
        week: 'mt-1 flex w-full',
        day: 'relative size-9 p-0 text-center text-sm',
        day_button: DAY_BUTTON,
        // Range endpoints: solid navy pill on a tinted cell.
        range_start:
          'rounded-l-md bg-navy/10 [&>button]:bg-navy [&>button]:text-white [&>button:hover]:bg-navy-mid',
        range_end:
          'rounded-r-md bg-navy/10 [&>button]:bg-navy [&>button]:text-white [&>button:hover]:bg-navy-mid',
        // Days between endpoints: tinted track, no pill.
        range_middle:
          'bg-navy/10 [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-navy [&>button:hover]:bg-navy/20',
        today: '[&>button]:border [&>button]:border-gold [&>button]:font-semibold',
        outside: '[&>button]:text-gray-300',
        disabled: '[&>button]:pointer-events-none [&>button]:text-gray-200',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) =>
          orientation === 'left' ? (
            <ChevronLeft className={cn('size-4', chevronClassName)} aria-hidden="true" />
          ) : (
            <ChevronRight className={cn('size-4', chevronClassName)} aria-hidden="true" />
          ),
      }}
      {...props}
    />
  );
}
