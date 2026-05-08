import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
const decorativeOrbVariants = cva('pointer-events-none absolute rounded-full', {
    variants: {
        appearance: {
            'gold-fill': 'bg-gold/10',
            'gold-fill-soft': 'bg-gold/8',
            'gold-outline-light': 'border border-gold/10 bg-transparent',
            'gold-outline-medium': 'border border-gold/15 bg-transparent',
            'white-outline-faint': 'border border-white/[0.04] bg-transparent',
            'white-outline-soft': 'border border-white/[0.05] bg-transparent',
            'white-outline-muted': 'border border-white/[0.06] bg-transparent',
        },
        size: {
            sm: 'size-24',
            md: 'size-28',
            lg: 'size-40',
            xl: 'size-64',
            none: '',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
const DecorativeOrb = React.forwardRef(({ className, appearance, size, ...props }, ref) => (_jsx("div", { ref: ref, "aria-hidden": true, className: cn(decorativeOrbVariants({ appearance, size }), className), ...props })));
DecorativeOrb.displayName = 'DecorativeOrb';
export { DecorativeOrb, decorativeOrbVariants };
