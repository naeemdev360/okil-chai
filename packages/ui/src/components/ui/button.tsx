import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Spinner } from '../loading/spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-all duration-base disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-navy text-white hover:bg-navy-light rounded-md',
        gold:
          'bg-gold text-navy font-semibold hover:bg-gold-light rounded-md',
        outline:
          'border-2 border-navy text-navy bg-transparent hover:bg-navy hover:text-white rounded-md',
        ghost:
          'text-gray-600 bg-transparent hover:text-navy hover:bg-gray-50 rounded-md',
        destructive:
          'bg-error text-white hover:opacity-90 rounded-md',
        link:
          'text-navy underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm:  'text-sm px-3.5 py-1.5',
        md:  'text-sm px-5 py-2.5',
        lg:  'text-base px-7 py-3',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
  readonly isLoading?: boolean;
  readonly loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {asChild ? children : (
          <>
            {isLoading && <Spinner size="sm" />}
            {isLoading && loadingText ? loadingText : children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
