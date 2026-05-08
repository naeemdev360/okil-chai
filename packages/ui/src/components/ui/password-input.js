'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Input } from './input';
export function PasswordInput({ className, ...props }) {
    const [show, setShow] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none", "aria-hidden": "true" }), _jsx(Input, { type: show ? 'text' : 'password', className: cn('pl-10 pr-10', className), ...props }), _jsx("button", { type: "button", onClick: () => setShow((v) => !v), "aria-label": show ? 'Hide password' : 'Show password', className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors", children: show
                    ? _jsx(EyeOff, { className: "size-4", "aria-hidden": "true" })
                    : _jsx(Eye, { className: "size-4", "aria-hidden": "true" }) })] }));
}
