import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../utils/cn';
const Textarea = React.forwardRef(({ className, ...props }, ref) => (_jsx("textarea", { className: cn('flex min-h-[96px] w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5', 'text-sm font-sans text-gray-800 placeholder:text-gray-400', 'resize-vertical transition-colors duration-base', 'focus-visible:outline-none focus-visible:border-navy focus-visible:ring-1 focus-visible:ring-navy', 'disabled:cursor-not-allowed disabled:opacity-50', className), ref: ref, ...props })));
Textarea.displayName = 'Textarea';
export { Textarea };
