import { Button, DecorativeOrb, StatCard } from '@okil-chai/ui';
import { Calendar, Clock, CreditCard, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../../../lib/mock-data';

const STAT_DATA = [
  { label: 'Total Consultations', value: String(CURRENT_USER.stats.totalConsultations), icon: <Calendar   size={15} />, delta: '+2 this month' },
  { label: 'Hours Consulted',     value: CURRENT_USER.stats.hoursConsulted,              icon: <Clock      size={15} />, delta: '60 min avg'   },
  { label: 'Total Spent',         value: CURRENT_USER.stats.totalSpent,                  icon: <CreditCard size={15} />, delta: '7 invoices'   },
  { label: 'Saved Lawyers',       value: String(CURRENT_USER.stats.savedLawyers),        icon: <Heart      size={15} />, delta: 'View all'     },
] as const;

export function WelcomeBanner() {
  const navigate = useNavigate();
  const { name, upcomingCount, unreadMessages } = CURRENT_USER;

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
            <span className="text-gold font-semibold">{upcomingCount} upcoming consultations</span>
            {' '}and{' '}
            <span className="text-gold font-semibold">{unreadMessages} unread messages</span>.
          </p>
        </div>
        <Button variant="gold" onClick={() => navigate('/search')} className="w-full shrink-0 sm:w-auto">
          <Plus size={14} /> Book a Consultation
        </Button>
      </div>

      <div className="relative z-[1] mt-7 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
        {STAT_DATA.map((s) => (
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
