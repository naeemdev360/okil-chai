import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { PendingVerificationBanner } from '../../components/features/PendingVerificationBanner';
function StatCard({ icon: Icon, label, value, sub }) {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-sm p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("p", { className: "font-sans text-sm font-medium text-gray-600", children: label }), _jsx("div", { className: "size-9 rounded-lg bg-gold-pale flex items-center justify-center", children: _jsx(Icon, { className: "size-4 text-gold", strokeWidth: 1.6, "aria-hidden": "true" }) })] }), _jsx("p", { className: "font-heading text-3xl font-bold text-navy mb-1", children: value }), _jsx("p", { className: "font-sans text-xs text-gray-400", children: sub })] }));
}
export function DashboardPage() {
    return (_jsxs("div", { className: "min-h-screen bg-cream", children: [_jsx(PendingVerificationBanner, {}), _jsx("header", { className: "bg-white border-b border-gray-100 px-8 py-4", children: _jsxs("div", { className: "max-w-[1200px] mx-auto flex items-center justify-between", children: [_jsx("span", { className: "font-heading font-bold text-xl text-navy tracking-tight", children: "OkilChai" }), _jsx("div", { className: "size-9 rounded-full bg-navy flex items-center justify-center font-heading font-bold text-sm text-white", children: "L" })] }) }), _jsxs("main", { className: "max-w-[1200px] mx-auto px-8 py-10", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "font-heading text-[32px] font-bold text-navy mb-1", children: "Welcome to your dashboard" }), _jsx("p", { className: "font-sans text-[15px] text-gray-600", children: "Your profile is being reviewed. In the meantime, explore what's available." })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10", children: [_jsx(StatCard, { icon: Calendar, label: "Upcoming Appointments", value: "\u2014", sub: "Available after verification" }), _jsx(StatCard, { icon: MessageSquare, label: "Messages", value: "\u2014", sub: "Available after verification" }), _jsx(StatCard, { icon: Eye, label: "Profile Views", value: "\u2014", sub: "Available after verification" }), _jsx(StatCard, { icon: TrendingUp, label: "This Month's Earnings", value: "\u2014", sub: "Available after verification" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-sm p-7", children: [_jsx("h2", { className: "font-heading text-xl font-semibold text-navy mb-5", children: "What happens next" }), _jsx("ol", { className: "flex flex-col gap-4 list-none", children: [
                                    {
                                        step: '01',
                                        title: 'Profile review',
                                        body: 'Our team verifies your bar credentials against official registries. This takes 24–48 hours.',
                                        done: true,
                                    },
                                    {
                                        step: '02',
                                        title: 'Approval email',
                                        body: "You'll receive an email once your profile is approved and live for clients to find.",
                                        done: false,
                                    },
                                    {
                                        step: '03',
                                        title: 'Connect Stripe',
                                        body: 'Set up your payout account to receive payments for consultations.',
                                        done: false,
                                    },
                                    {
                                        step: '04',
                                        title: 'Start taking bookings',
                                        body: 'Your profile goes live and clients can discover and book consultations with you.',
                                        done: false,
                                    },
                                ].map(({ step, title, body, done }) => (_jsxs("li", { className: "flex gap-4 items-start", children: [_jsx("span", { className: [
                                                'shrink-0 font-sans text-xs font-bold tracking-widest px-2.5 py-1 rounded-full',
                                                done ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-400',
                                            ].join(' '), children: step }), _jsxs("div", { children: [_jsx("p", { className: "font-sans text-sm font-semibold text-navy", children: title }), _jsx("p", { className: "font-sans text-xs text-gray-600 mt-0.5 leading-relaxed", children: body })] })] }, step))) })] })] })] }));
}
