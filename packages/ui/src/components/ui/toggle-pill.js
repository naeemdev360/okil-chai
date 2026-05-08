import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
const togglePillVariants = cva('inline-flex items-center justify-center font-sans font-medium border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', {
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
            // Vertical card layout — use for option cards with icon + label + description stacked
            card: [
                'flex flex-col items-center justify-start text-center',
                'bg-white text-navy border-gray-200',
                'hover:border-navy/40',
                'data-[active=true]:bg-navy data-[active=true]:text-white data-[active=true]:border-navy data-[active=true]:font-semibold',
            ],
        },
        size: {
            sm: 'text-xs px-2.5 py-1.5 rounded-md',
            md: 'text-sm px-3.5 py-2 rounded-md',
            card: 'py-3.5 px-2.5 rounded-lg w-full',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'sm',
    },
});
const TogglePill = React.forwardRef(({ className, variant, size, active, ...props }, ref) => (_jsx("button", { ref: ref, type: "button", "data-active": active, "aria-pressed": active, className: cn(togglePillVariants({ variant, size, className })), ...props })));
TogglePill.displayName = 'TogglePill';
export { TogglePill, togglePillVariants };
