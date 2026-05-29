import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SegmentItem {
  readonly id: string;
  readonly label: string;
}

interface SegmentedControlProps {
  readonly items: readonly SegmentItem[];
  readonly active: string;
  readonly onChange: (id: string) => void;
  /** Accessible name for the group, announced to screen readers. */
  readonly ariaLabel?: string;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
}

const SEGMENT_SIZES = {
  sm: 'px-3 py-1 text-[12px]',
  md: 'px-4 py-1.5 text-[13px]',
} as const;

/**
 * Pill-track segmented control — a row of mutually exclusive options where the
 * active option lifts to a white surface inside a recessed track. Use on
 * white/cream surfaces for compact filters (status, view mode) where `TabBar`'s
 * underline style would be too heavy.
 */
export function SegmentedControl({
  items,
  active,
  onChange,
  ariaLabel,
  size = 'md',
  className,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 self-start rounded-full bg-gray-50 p-1 border border-gray-100',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              'rounded-full font-sans transition-all duration-150 whitespace-nowrap',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20',
              SEGMENT_SIZES[size],
              isActive
                ? 'bg-white text-navy font-semibold shadow-sm'
                : 'text-gray-500 hover:text-navy',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
