import { useClientDashboard, usePortalAuth } from '@repo/hooks';
import { Button, DecorativeOrb, StatCard } from '@repo/ui';
import { Calendar, Clock, CreditCard, Heart, Plus } from 'lucide-react';
import { appUrls } from '../../../lib/app-urls';

export function WelcomeBanner() {
  const { user } = usePortalAuth();
  const { data: stats } = useClientDashboard();

  const name = user ? `${user.firstName} ${user.lastName}` : '';
  const upcomingCount = stats?.upcomingCount ?? 0;
  const unreadMessages = stats?.unreadMessagesCount ?? 0;

  const totalSpent = stats?.totalAmountSpent
    ? `$${parseFloat(stats.totalAmountSpent).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : '$0';

  const statData = [
    { label: 'Total Consultations', value: String(stats?.completedCount ?? 0),  icon: <Calendar   size={15} />, delta: '+2 this month' },
    { label: 'Hours Consulted',     value: '—',                                  icon: <Clock      size={15} />, delta: '60 min avg'   },
    { label: 'Total Spent',         value: totalSpent,                            icon: <CreditCard size={15} />, delta: 'invoices'     },
    { label: 'Saved Lawyers',       value: String(stats?.savedLawyersCount ?? 0), icon: <Heart      size={15} />, delta: 'View all'     },
  ] as const;

  return (
    <div className="relative mb-7 overflow-hidden rounded-xl bg-navy p-5 sm:p-8">
      <DecorativeOrb appearance="gold-outline-medium" size="xl" className="-right-16 -top-16 z-0" />
      <DecorativeOrb appearance="gold-outline-light" size="lg" className="-right-4 -top-4 z-0" />

      <div className="relative z-[1] flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-[13px] font-sans text-white/55 mb-1.5 tracking-[0.04em] uppercase">
            Welcome Back
          </p>
          <h1 className="font-heading text-2xl sm:text-[32px] font-bold text-white mb-2 leading-tight">{name}</h1>
          <p className="font-sans text-sm text-white/65 leading-relaxed">
            You have{' '}
            <span className="text-gold font-semibold">{upcomingCount} upcoming {upcomingCount === 1 ? 'consultation' : 'consultations'}</span>
            {' '}and{' '}
            <span className="text-gold font-semibold">{unreadMessages} unread {unreadMessages === 1 ? 'message' : 'messages'}</span>.
          </p>
        </div>
        <Button variant="gold" onClick={() => { window.location.href = appUrls.search; }} className="w-full shrink-0 sm:w-auto">
          <Plus size={14} /> Book a Consultation
        </Button>
      </div>

      <div className="relative z-[1] mt-7 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
        {statData.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={<span className="text-gold">{s.icon}</span>}
            className="bg-white/[0.06] border-white/[0.08] text-white"
          />
        ))}
      </div>
    </div>
  );
}
