import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';
export function StarRating({ rating, count = null, variant = 'score', size = 'sm', countClassName, className, }) {
    const starClass = size === 'xs' ? 'size-3' : 'size-3.5';
    const defaultCountClass = 'text-gray-400';
    if (variant === 'score') {
        return (_jsxs("span", { className: cn('inline-flex items-center gap-1', className), children: [_jsx(Star, { className: cn(starClass, 'fill-gold text-gold shrink-0'), "aria-hidden": true }), _jsx("span", { className: "font-sans text-sm font-semibold text-navy", children: rating }), count !== null && (_jsxs("span", { className: cn('font-sans text-xs', countClassName ?? defaultCountClass), children: ["(", count, ")"] }))] }));
    }
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1', className), children: [[1, 2, 3, 4, 5].map((i) => (_jsx(Star, { className: cn(starClass, i <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'), "aria-hidden": true }, i))), count !== null && (_jsxs("span", { className: cn('font-sans text-sm ml-1', countClassName ?? defaultCountClass), children: ["(", count, ")"] }))] }));
}
