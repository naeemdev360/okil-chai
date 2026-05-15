import { ToggleSwitch } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';
import { SettingField } from '../SettingField';

const ROWS = [
  { label: 'New booking requests',  desc: 'When a client requests a consultation',   push: true,  email: true,  sms: true  },
  { label: 'Booking confirmations', desc: 'When a client confirms or pre-pays',       push: true,  email: false, sms: false },
  { label: 'Booking cancellations', desc: 'When a client cancels or reschedules',     push: true,  email: true,  sms: false },
  { label: 'Client messages',       desc: 'New chat messages from clients',           push: true,  email: false, sms: false },
  { label: 'New reviews',           desc: 'When a client leaves you a review',        push: true,  email: false, sms: false },
  { label: 'Payouts',               desc: 'When earnings are deposited to your bank', push: false, email: true,  sms: false },
  { label: 'Document shares',       desc: 'When a client shares or signs a document', push: true,  email: false, sms: false },
  { label: 'Platform updates',      desc: 'Product news, policy changes, tips',       push: false, email: false, sms: false },
] as const;

export function NotifPrefsPanel() {
  return (
    <>
      <SettingGroup title="Channels">
        <table className="w-full border-collapse">
          <thead>
            <tr className="font-sans text-[10px] text-gray-400 font-semibold tracking-[0.08em] uppercase text-left">
              <th className="pb-2.5 font-sans">Event</th>
              <th className="pb-2.5 w-16 text-center font-sans">Push</th>
              <th className="pb-2.5 w-16 text-center font-sans">Email</th>
              <th className="pb-2.5 w-16 text-center font-sans">SMS</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(r => (
              <tr key={r.label} className="border-t border-gray-100">
                <td className="py-3.5">
                  <div className="font-sans text-[13px] text-navy font-medium">{r.label}</div>
                  <div className="font-sans text-[12px] text-gray-600 mt-0.5">{r.desc}</div>
                </td>
                <td className="text-center"><ToggleSwitch checked={r.push} onChange={() => {}} /></td>
                <td className="text-center"><ToggleSwitch checked={r.email} onChange={() => {}} /></td>
                <td className="text-center"><ToggleSwitch checked={r.sms} onChange={() => {}} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingGroup>

      <SettingGroup title="Quiet hours" last>
        <div className="flex items-center justify-between py-3 border-t border-gray-100 flex-wrap gap-3">
          <div className="flex-1 min-w-[160px]">
            <div className="font-sans text-[13px] text-navy font-medium">Pause non-urgent notifications</div>
            <div className="font-sans text-[12px] text-gray-600 mt-0.5">Booking requests and reminders still come through</div>
          </div>
          <ToggleSwitch checked={true} onChange={() => {}} />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <SettingField label="Start" defaultValue="9:00 PM" mono />
          <SettingField label="End"   defaultValue="7:00 AM" mono />
        </div>
      </SettingGroup>
    </>
  );
}
