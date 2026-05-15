import { Download, Sparkles } from 'lucide-react';
import { Badge, DecorativeOrb } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';
import { SettingRow } from '../SettingRow';

const PLAN_STATS = [
  { label: 'Bookings this month', value: '12'       },
  { label: 'Featured placement',  value: 'Active'   },
  { label: 'Reduced fee',         value: '12%'      },
  { label: 'Storage',             value: '3.2 / 10 GB' },
] as const;

const BILLING_HISTORY = [
  { date: 'Apr 12, 2026', desc: 'LegalConnect Pro — Monthly', amount: '$49.00' },
  { date: 'Mar 12, 2026', desc: 'LegalConnect Pro — Monthly', amount: '$49.00' },
  { date: 'Feb 12, 2026', desc: 'LegalConnect Pro — Monthly', amount: '$49.00' },
] as const;

export function SubscriptionPanel() {
  return (
    <>
      {/* Plan card */}
      <div className="bg-navy text-white rounded-xl p-7 mb-6 relative overflow-hidden">
        <DecorativeOrb appearance="gold-fill" size="lg" className="-top-10 -right-10" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-gold" strokeWidth={1.5} />
              <span className="font-sans text-[10px] text-gold font-bold tracking-[0.1em] uppercase">Current plan</span>
            </div>
            <div className="font-heading text-[28px] font-bold mb-1">LegalConnect Pro</div>
            <div className="font-sans text-[13px] text-white/70">$49/month · Renews May 12, 2026</div>
          </div>
          <button className="px-4 py-2 border border-white/20 rounded-md font-sans text-[13px] text-white hover:bg-white/8 transition-colors">
            Change plan
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 relative">
          {PLAN_STATS.map(p => (
            <div key={p.label}>
              <div className="font-heading text-[20px] font-bold text-gold">{p.value}</div>
              <div className="font-sans text-[11px] text-white/60 tracking-[0.04em] mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <SettingGroup title="Payment method">
        <SettingRow
          label="Visa •••• 8842"
          sub="Expires 04/2028 — default for subscription"
          right={<Badge variant="available">Active</Badge>}
        >
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            Replace
          </button>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Billing history" last>
        {BILLING_HISTORY.map((b, i) => (
          <div key={i} className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="flex-1">
              <div className="font-sans text-[13px] text-navy font-medium">{b.desc}</div>
              <div className="font-sans text-[12px] text-gray-600">{b.date}</div>
            </div>
            <div className="font-mono text-[13px] text-navy font-semibold">{b.amount}</div>
            <button className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Download size={13} className="text-gray-600" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </SettingGroup>
    </>
  );
}
