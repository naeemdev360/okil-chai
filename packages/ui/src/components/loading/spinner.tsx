import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const spinnerVariants = cva('animate-spin shrink-0', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-7',
      xl: 'size-10',
    },
    color: {
      navy:    'text-navy',
      gold:    'text-gold',
      white:   'text-white',
      current: 'text-current',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  readonly className?: string;
  readonly label?: string;
}

export function Spinner({ size, color, className, label = 'Loading…' }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(spinnerVariants({ size, color }), className)}
    >
      {/* Track ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      {/* Rotating arc — ~75% of circumference */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="47 16"
      />
    </svg>
  );
}
