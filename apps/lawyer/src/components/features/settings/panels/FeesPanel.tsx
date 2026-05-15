import { Edit } from 'lucide-react';
import { ToggleSwitch } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';
import { SettingRow } from '../SettingRow';

const SERVICE_RATES = [
  { service: 'Video consultation (60 min)',      rate: 180, on: true,  free: false },
  { service: 'Phone consultation (45 min)',       rate: 135, on: true,  free: false },
  { service: 'In-person consultation (90 min)',   rate: 270, on: true,  free: false },
  { service: 'Document review (per hour)',        rate: 220, on: true,  free: false },
  { service: 'Initial intake call (15 min)',      rate: 0,   on: true,  free: true  },
] as const;

const CANCEL_POLICIES = [
  { label: 'Refund within 24 hours of booking',  sub: 'Full refund if client cancels at least 24 hours before' },
  { label: '50% fee for late cancellations',     sub: 'Less than 24 hours notice' },
  { label: 'No-show fee',                        sub: 'Charge 100% if the client does not attend' },
] as const;

export function FeesPanel() {
  return (
    <>
      <SettingGroup title="Base hourly rate">
        <div className="flex items-center gap-4 p-4 bg-cream rounded-md border border-gray-100">
          <div className="flex-1">
            <div className="font-heading text-[36px] font-bold text-navy leading-none">
              $180<span className="text-[16px] text-gray-600 font-normal">/hour</span>
            </div>
            <div className="font-sans text-[12px] text-gray-600 mt-1.5">
              Average for Criminal Defense in Boston:{' '}
              <strong className="text-navy">$165–$240</strong>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy hover:bg-gray-50 transition-colors">
            <Edit size={13} strokeWidth={1.5} /> Adjust rate
          </button>
        </div>
      </SettingGroup>

      <SettingGroup title="Service rates">
        <p className="font-sans text-[12px] text-gray-600 mb-3.5 leading-relaxed">
          Override the base rate for specific consultation types.
        </p>
        {SERVICE_RATES.map((s, i) => (
          <div key={s.service} className={`grid grid-cols-[1fr_100px_48px] gap-3 items-center py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <span className="font-sans text-[13px] text-navy font-medium">{s.service}</span>
            <div className="relative">
              {!s.free && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">$</span>}
              <input
                defaultValue={s.free ? 'Free' : String(s.rate)}
                className={`w-full py-2 border-[1.5px] border-gray-200 rounded-md font-mono text-[13px] text-navy outline-none focus:border-navy transition-colors ${s.free ? 'pl-2.5' : 'pl-6'}`}
              />
            </div>
            <ToggleSwitch checked={s.on} onChange={() => {}} />
          </div>
        ))}
      </SettingGroup>

      <SettingGroup title="Cancellation policy" last>
        {CANCEL_POLICIES.map(p => (
          <SettingRow key={p.label} label={p.label} sub={p.sub}>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </SettingRow>
        ))}
      </SettingGroup>
    </>
  );
}
