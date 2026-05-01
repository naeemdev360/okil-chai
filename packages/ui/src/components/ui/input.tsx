import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-sans text-gray-800 placeholder:text-gray-400',
        'transition-colors duration-base',
        'focus-visible:outline-none focus-visible:border-navy focus-visible:ring-1 focus-visible:ring-navy',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
