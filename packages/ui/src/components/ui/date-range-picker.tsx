'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '../../utils/cn';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type { DateRange };

interface DateRangePickerProps {
  readonly value: DateRange | undefined;
  readonly onChange: (range: DateRange | undefined) => void;
  readonly placeholder?: string;
  readonly numberOfMonths?: number;
  readonly align?: 'start' | 'center' | 'end';
  readonly disabled?: boolean;
  /** Show an inline clear button once a range is set. */
  readonly clearable?: boolean;
  readonly className?: string;
}

const LABEL_FORMAT = 'MMM d, yyyy';

function formatRangeLabel(range: DateRange | undefined, placeholder: string): string {
  if (!range?.from) return placeholder;
  if (!range.to) return format(range.from, LABEL_FORMAT);
  return `${format(range.from, LABEL_FORMAT)} – ${format(range.to, LABEL_FORMAT)}`;
}

/**
 * Themed date-range picker: a trigger button that opens a popover calendar in
 * range mode. Emits react-day-picker's `DateRange` ({ from, to }).
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select dates',
  numberOfMonths = 2,
  align = 'start',
  disabled,
  clearable = true,
  className,
}: DateRangePickerProps) {
  const hasValue = Boolean(value?.from);

  function handleClear(event: React.MouseEvent) {
    // Prevent the popover from toggling when clearing inside the trigger.
    event.stopPropagation();
    onChange(undefined);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Select date range"
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-md border-[1.5px] border-gray-200 bg-white px-3 font-sans text-[13px]',
            'transition-colors hover:border-gray-300 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasValue ? 'text-gray-800' : 'text-gray-400',
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
          <span className="truncate">{formatRangeLabel(value, placeholder)}</span>
          {clearable && hasValue && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date range"
              onClick={handleClear}
              className="ml-0.5 grid size-4 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy"
            >
              <X className="size-3" aria-hidden="true" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align={align}>
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={numberOfMonths}
          defaultMonth={value?.from}
        />
      </PopoverContent>
    </Popover>
  );
}
