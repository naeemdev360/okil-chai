import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
import { NotificationIcon } from './NotificationIcon';
function defaultRenderLink(href, label) {
    return (_jsxs("a", { href: href, className: "inline-block mt-[10px] font-sans text-[13px] font-semibold text-navy underline underline-offset-[3px] hover:opacity-70 transition-opacity", children: [label, " \u2192"] }));
}
export function NotificationRow({ notification: n, renderLink = defaultRenderLink }) {
    return (_jsxs("div", { className: cn('relative flex items-start gap-4 px-6 py-4 border-b border-gray-100 transition-colors duration-150', !n.isRead
            ? 'border-l-[3px] border-l-gold bg-gold/5'
            : 'border-l-[3px] border-l-transparent'), children: [!n.isRead && (_jsx("span", { "aria-hidden": "true", className: "absolute top-[18px] right-4 w-2 h-2 rounded-full bg-gold" })), _jsx(NotificationIcon, { type: n.type, size: "md" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [_jsx("p", { className: cn('font-sans text-sm text-navy leading-snug', n.isRead ? 'font-normal' : 'font-semibold'), children: n.title }), _jsx("span", { className: "font-sans text-[11px] text-gray-400 whitespace-nowrap shrink-0", children: n.time })] }), _jsx("p", { className: "font-sans text-[13px] text-gray-600 leading-[1.5]", children: n.description }), n.actionLabel && n.actionHref && renderLink(n.actionHref, n.actionLabel)] })] }));
}
