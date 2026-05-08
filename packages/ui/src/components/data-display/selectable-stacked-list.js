import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
export function SelectableStackedList({ className, children, ...props }) {
    return (_jsx("div", { className: cn('overflow-y-auto', className), ...props, children: children }));
}
export const stackedListItemVariants = cva('flex w-full items-center gap-3 px-4 py-3.5 text-left border-b border-gray-100 border-l-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset', {
    variants: {
        state: {
            active: 'bg-gold-pale border-l-gold',
            inactive: 'border-l-transparent hover:bg-gray-50',
        },
    },
    defaultVariants: {
        state: 'inactive',
    },
});
export const SelectableStackedListItem = React.forwardRef(({ isSelected = false, leading, headline, meta, subtitle, trailing, className, type = 'button', ...props }, ref) => {
    return (_jsxs("button", { ref: ref, type: type, "aria-current": isSelected ? 'true' : undefined, className: cn(stackedListItemVariants({ state: isSelected ? 'active' : 'inactive' }), className), ...props, children: [leading, _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "mb-0.5 flex min-w-0 items-center justify-between gap-2", children: [_jsx("span", { className: "min-w-0 truncate text-[13px] font-semibold text-navy font-sans", children: headline }), meta != null && _jsx("span", { className: "shrink-0 text-[11px] text-gray-400 font-sans", children: meta })] }), subtitle != null && _jsx("p", { className: "truncate text-xs text-gray-600 font-sans", children: subtitle })] }), trailing] }));
});
SelectableStackedListItem.displayName = 'SelectableStackedListItem';
