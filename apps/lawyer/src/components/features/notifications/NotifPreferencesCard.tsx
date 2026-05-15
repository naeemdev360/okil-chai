import { useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { SectionLabel } from '../../ui/SectionLabel';
import { NOTIF_PREFS } from '../../../routes/notifications/notifications.constants';

export function NotifPreferencesCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <SectionLabel>Notification preferences</SectionLabel>
      <p className="font-sans text-[12px] text-gray-600 mb-3 leading-relaxed">
        Pick how each event reaches you. Critical alerts always send to email.
      </p>
      {NOTIF_PREFS.map((p, i) => (
        <div
          key={p.k}
          className={`flex items-center justify-between py-2.5 ${i > 0 ? 'border-t border-gray-100' : ''}`}
        >
          <span className="font-sans text-[13px] text-navy font-medium">{p.label}</span>
          <div className="flex gap-3.5 items-center">
            <ChannelToggle on={p.push} icon={<Bell size={11} strokeWidth={1.5} />} />
            <ChannelToggle on={p.email} icon={<Mail size={11} strokeWidth={1.5} />} />
          </div>
        </div>
      ))}
      <div className="flex gap-3.5 items-center justify-end mt-2 text-[10px] text-gray-400 font-sans tracking-[0.06em] uppercase font-semibold">
        <span className="inline-flex items-center gap-1"><Bell size={10} /> Push</span>
        <span className="inline-flex items-center gap-1"><Mail size={10} /> Email</span>
      </div>
    </div>
  );
}

function ChannelToggle({ on, icon }: { on: boolean; icon: React.ReactNode }) {
  const [active, setActive] = useState(on);
  return (
    <button
      onClick={() => setActive(v => !v)}
      className={`w-8 h-6 rounded flex items-center justify-center border transition-all ${active ? 'bg-success-bg border-success/30 text-success' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
    >
      {icon}
    </button>
  );
}
