import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
export function StatCard({ label, value, delta, icon, className }) {
    return (_jsxs("div", { className: cn('isolate min-w-0 rounded-lg border p-3.5 sm:p-4', className), children: [_jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [_jsx("span", { className: "min-w-0 flex-1 text-[11px] font-sans font-semibold uppercase leading-snug tracking-[0.06em] opacity-45", children: label }), icon ? (_jsx("span", { className: "shrink-0 opacity-80 [&_svg]:block", "aria-hidden": true, children: icon })) : null] }), _jsx("div", { className: "mb-1 font-heading text-xl font-bold leading-tight tabular-nums sm:text-[26px] sm:leading-none", children: value }), delta ? _jsx("div", { className: "text-[11px] font-sans leading-snug opacity-40", children: delta }) : null] }));
}
