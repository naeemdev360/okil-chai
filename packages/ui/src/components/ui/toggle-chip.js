import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
export function ToggleChip({ active, rounded = false, onClick, children }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: cn('px-4 py-2 text-sm font-sans font-medium border-[1.5px] transition-all duration-150', rounded ? 'rounded-full' : 'rounded-md', active
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'), children: [active && _jsx(Check, { className: "inline size-3 mr-1 -mt-0.5", strokeWidth: 2.5, "aria-hidden": "true" }), children] }));
}
