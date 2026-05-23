'use client';

import { Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

const SEGMENT_CLASS = cn(
  'h-8 w-11 rounded border-0 bg-transparent px-1.5 py-0',
  'text-center text-sm font-sans font-medium text-gray-800',
  'hover:bg-gray-50',
  'focus:outline-none focus:ring-0 focus:bg-gray-50',
  '[&>svg]:hidden [&>span]:w-full [&>span]:text-center',
);

export interface TimePickerProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly className?: string;
  readonly disabled?: boolean;
}

export function TimePicker({ value, onChange, className, disabled }: TimePickerProps) {
  const [hour = '09', minute = '00'] = value ? value.split(':') : [];

  const handleHour = (h: string) => onChange(`${h}:${minute}`);
  const handleMinute = (m: string) => onChange(`${hour}:${m}`);

  return (
    <div
      className={cn(
        'flex h-11 w-fit items-center gap-1 rounded-md border border-gray-200 bg-white px-3',
        'transition-colors duration-base',
        'focus-within:border-navy focus-within:ring-1 focus-within:ring-navy',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <Clock className="size-4 text-gray-400 shrink-0 mr-1" aria-hidden="true" />

      <Select value={hour} onValueChange={handleHour} disabled={disabled}>
        <SelectTrigger className={SEGMENT_CLASS} aria-label="Hour">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-52 min-w-[72px]">
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="font-sans text-sm font-semibold text-gray-300 select-none">:</span>

      <Select value={minute} onValueChange={handleMinute} disabled={disabled} >
        <SelectTrigger className={SEGMENT_CLASS} aria-label="Minute">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-52 min-w-[72px]">
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
