'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useTransition } from 'react';
import { cn } from '../../utils/cn';
export function LanguageSwitcher({ locales, activeLocale, onSwitch, className, }) {
    const [isPending, startTransition] = useTransition();
    const handleSwitch = (code) => {
        if (code === activeLocale)
            return;
        startTransition(() => onSwitch(code));
    };
    return (_jsx("div", { role: "group", "aria-label": "Select language", className: cn('inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-1', 'transition-opacity duration-150', isPending && 'pointer-events-none opacity-60', className), children: locales.map(({ code, label }) => {
            const active = code === activeLocale;
            return (_jsx("button", { type: "button", onClick: () => handleSwitch(code), "aria-pressed": active, className: cn('rounded-full px-3.5 py-1 font-sans text-sm font-semibold', 'transition-all duration-200 select-none', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1', active
                    ? 'bg-navy text-white shadow-sm focus-visible:ring-gold'
                    : 'text-gray-500 hover:text-navy focus-visible:ring-navy'), children: label }, code));
        }) }));
}
