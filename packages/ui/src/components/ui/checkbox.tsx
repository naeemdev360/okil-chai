'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const checkboxVariants = cva(
  [
    'peer shrink-0 rounded-sm border-[1.5px] bg-white',
    'transition-all duration-base',
    'hover:border-gray-400',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-200 data-[state=checked]:bg-navy data-[state=checked]:border-navy',
        gold:    'border-gray-200 data-[state=checked]:bg-gold data-[state=checked]:border-gold',
      },
      size: {
        sm: 'size-3.5',
        md: 'size-[18px]',
        lg: 'size-[22px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

const ICON_SIZE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-2.5',
  md: 'size-3',
  lg: 'size-3.5',
};

const ICON_COLOR: Record<'default' | 'gold', string> = {
  default: 'text-white',
  gold:    'text-navy',
};

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      forceMount
      className={cn(
        'flex items-center justify-center',
        'transition-all duration-base',
        'data-[state=unchecked]:opacity-0 data-[state=unchecked]:scale-50',
        'data-[state=checked]:opacity-100 data-[state=checked]:scale-100',
      )}
    >
      <Check
        className={cn(ICON_SIZE[size ?? 'md'], ICON_COLOR[variant ?? 'default'])}
        strokeWidth={2.8}
        aria-hidden="true"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
