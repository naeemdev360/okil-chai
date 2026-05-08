'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
// ─── RadioGroup (root) ────────────────────────────────────────────────────────
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx(RadioGroupPrimitive.Root, { ref: ref, className: cn('flex flex-col gap-2.5', className), ...props })));
RadioGroup.displayName = 'RadioGroup';
// ─── RadioItem variants ───────────────────────────────────────────────────────
const radioItemVariants = cva([
    'group relative shrink-0 rounded-full border-[1.5px] bg-white',
    'flex items-center justify-center',
    'transition-all duration-base',
    'hover:border-gray-400',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
], {
    variants: {
        variant: {
            default: 'border-gray-200 data-[state=checked]:bg-navy  data-[state=checked]:border-navy',
            gold: 'border-gray-200 data-[state=checked]:bg-gold   data-[state=checked]:border-gold',
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
});
const DOT_SIZE = {
    sm: 'size-1.5',
    md: 'size-2',
    lg: 'size-2.5',
};
const DOT_COLOR = {
    default: 'bg-white',
    gold: 'bg-navy',
};
const RadioItem = React.forwardRef(({ className, variant = 'default', size = 'md', ...props }, ref) => (_jsx(RadioGroupPrimitive.Item, { ref: ref, className: cn(radioItemVariants({ variant, size }), className), ...props, children: _jsx(RadioGroupPrimitive.Indicator, { forceMount: true, className: "flex items-center justify-center", children: _jsx("span", { className: cn('rounded-full transition-transform duration-base', DOT_SIZE[size ?? 'md'], DOT_COLOR[variant ?? 'default'], 'group-data-[state=unchecked]:scale-0', 'group-data-[state=checked]:scale-100') }) }) })));
RadioItem.displayName = 'RadioItem';
export { RadioGroup, RadioItem };
