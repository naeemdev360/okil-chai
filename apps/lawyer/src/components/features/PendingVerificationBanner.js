import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Clock, X, Mail } from 'lucide-react';
const STORAGE_KEY = 'okilchai_lawyer_pending';
const SESSION_DISMISSED_KEY = 'okilchai_lawyer_pending_dismissed';
export function PendingVerificationBanner() {
    const isPending = localStorage.getItem(STORAGE_KEY) === 'true';
    const [dismissed, setDismissed] = useState(sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true');
    if (!isPending || dismissed)
        return null;
    const handleDismiss = () => {
        sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
        setDismissed(true);
    };
    return (_jsx("div", { className: "w-full bg-warning-bg border-b border-warning/30", children: _jsxs("div", { className: "max-w-[1200px] mx-auto px-6 py-3 flex items-start gap-3", children: [_jsx("div", { className: "shrink-0 mt-0.5 size-5 rounded-full bg-warning flex items-center justify-center", children: _jsx(Clock, { className: "size-3 text-white", strokeWidth: 2.5, "aria-hidden": "true" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-sans text-sm font-semibold text-navy", children: "Your profile is under review" }), _jsxs("p", { className: "font-sans text-xs text-gray-600 mt-0.5 leading-relaxed", children: ["Our team is verifying your credentials. You'll receive an email within", ' ', _jsx("strong", { children: "24\u201348 hours" }), " once approved. Some features are limited until verification is complete."] }), _jsxs("div", { className: "flex items-center gap-1.5 mt-1.5", children: [_jsx(Mail, { className: "size-3 text-warning", "aria-hidden": "true" }), _jsx("span", { className: "font-sans text-xs text-gray-600", children: "Check your inbox for a confirmation email from OkilChai." })] })] }), _jsx("button", { type: "button", onClick: handleDismiss, "aria-label": "Dismiss verification notice", className: "shrink-0 text-gray-400 hover:text-navy transition-colors", children: _jsx(X, { className: "size-4", "aria-hidden": "true" }) })] }) }));
}
