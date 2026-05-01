import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const togglePillVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'bg-white text-gray-600 border-gray-200',
          'hover:border-navy/40',
          'data-[active=true]:bg-navy data-[active=true]:text-white data-[active=true]:border-navy data-[active=true]:font-semibold',
        ],
        gold: [
          'bg-white text-gray-600 border-gray-200',
          'hover:border-gold/60',
          'data-[active=true]:bg-gold data-[active=true]:text-navy data-[active=true]:border-gold data-[active=true]:font-semibold',
        ],
      },
      size: {
        sm: 'text-xs px-2.5 py-1.5 rounded-md',
        md: 'text-sm px-3.5 py-2 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

export interface TogglePillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof togglePillVariants> {
  readonly active: boolean;
}

const TogglePill = React.forwardRef<HTMLButtonElement, TogglePillProps>(
  ({ className, variant, size, active, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-active={active}
      aria-pressed={active}
      className={cn(togglePillVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
TogglePill.displayName = 'TogglePill';

export { TogglePill, togglePillVariants };
