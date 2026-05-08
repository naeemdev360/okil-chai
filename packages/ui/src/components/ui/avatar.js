'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
const SIZE_CLASSES = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base',
};
const ONLINE_DOT_CLASSES = {
    sm: 'size-2',
    md: 'size-2.5',
    lg: 'size-3',
    xl: 'size-3.5',
};
export function Avatar({ initials, size = 'md', isOnline = false, className }) {
    return (_jsxs("span", { className: "relative inline-flex shrink-0", children: [_jsx("span", { "aria-hidden": "true", className: cn('inline-flex items-center justify-center rounded-full bg-navy font-semibold text-white select-none', SIZE_CLASSES[size], className), children: initials.slice(0, 2).toUpperCase() }), isOnline ? (_jsx("span", { className: cn('absolute bottom-0 right-0 rounded-full border-2 border-white bg-success', ONLINE_DOT_CLASSES[size]), "aria-hidden": true })) : null] }));
}
