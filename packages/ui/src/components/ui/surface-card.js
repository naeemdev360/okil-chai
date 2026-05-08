import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
const surfaceCardVariants = cva('border bg-white', {
    variants: {
        radius: {
            '2xl': 'rounded-2xl',
            xl: 'rounded-xl',
            lg: 'rounded-lg',
        },
        borderWidth: {
            default: 'border border-gray-100',
            bold: 'border-2 border-gray-100',
        },
        elevation: {
            md: 'shadow-md',
            sm: 'shadow-sm',
            lg: 'shadow-lg',
            none: 'shadow-none',
        },
        padding: {
            default: 'p-6',
            sm: 'p-4',
            lg: 'p-8',
            none: 'p-0',
        },
    },
    defaultVariants: {
        radius: '2xl',
        borderWidth: 'default',
        elevation: 'md',
        padding: 'default',
    },
});
const SurfaceCard = React.forwardRef(({ className, elevation, padding, radius, borderWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (_jsx(Comp, { ref: ref, className: cn(surfaceCardVariants({ elevation, padding, radius, borderWidth }), className), ...props }));
});
SurfaceCard.displayName = 'SurfaceCard';
export { SurfaceCard, surfaceCardVariants };
