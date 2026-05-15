import { Badge } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';

const INTEGRATIONS = [
  { name: 'Google Calendar',  desc: 'Two-way sync with your Google Calendar', connected: true,  brand: '#4285F4', initial: 'G'  },
  { name: 'Stripe',           desc: 'Process payments and handle payouts',     connected: true,  brand: '#635BFF', initial: 'S'  },
  { name: 'Outlook Calendar', desc: 'Sync with Microsoft 365 calendar',        connected: false, brand: '#0078D4', initial: 'O'  },
  { name: 'Zoom',             desc: 'Use Zoom for video consultations',        connected: false, brand: '#2D8CFF', initial: 'Z'  },
  { name: 'Google Drive',     desc: 'Save case documents to Drive',            connected: true,  brand: '#0F9D58', initial: 'D'  },
  { name: 'DocuSign',         desc: 'Send documents for e-signature',          connected: false, brand: '#FFCC22', initial: 'DS' },
  { name: 'QuickBooks',       desc: 'Sync earnings and invoices for accounting', connected: false, brand: '#2CA01C', initial: 'Q' },
] as const;

export function IntegrationsPanel() {
  return (
    <SettingGroup title="Connected services" last>
      {INTEGRATIONS.map((it, i) => (
        <div
          key={it.name}
          className={`flex items-center gap-3.5 py-3.5 ${i > 0 ? 'border-t border-gray-100' : ''}`}
        >
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center font-heading font-bold text-[16px] text-white shrink-0"
            style={{ backgroundColor: it.brand }}
          >
            {it.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-sans text-[14px] text-navy font-semibold">{it.name}</span>
              {it.connected && <Badge variant="available">Connected</Badge>}
            </div>
            <div className="font-sans text-[12px] text-gray-600">{it.desc}</div>
          </div>
          {it.connected ? (
            <div className="flex gap-1.5 shrink-0">
              <button className="px-3 py-1.5 border border-gray-200 rounded-md font-sans text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">Configure</button>
              <button className="px-3 py-1.5 border border-error/40 text-error rounded-md font-sans text-[12px] hover:bg-error-bg transition-colors">Disconnect</button>
            </div>
          ) : (
            <button className="px-3.5 py-1.5 bg-navy text-white rounded-md font-sans text-[12px] font-medium hover:bg-navy-mid transition-colors shrink-0">
              Connect
            </button>
          )}
        </div>
      ))}
    </SettingGroup>
  );
}
