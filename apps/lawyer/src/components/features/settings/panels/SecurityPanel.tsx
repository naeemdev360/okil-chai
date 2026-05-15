import { Badge, ToggleSwitch } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';
import { SettingRow } from '../SettingRow';

const SESSIONS = [
  { device: 'MacBook Pro · Chrome',       loc: 'Boston, MA',    time: 'Active now',  current: true  },
  { device: 'iPhone 15 · LegalConnect app', loc: 'Boston, MA',  time: '2 hours ago', current: false },
  { device: 'iPad Pro · Safari',           loc: 'Cambridge, MA', time: '3 days ago',  current: false },
] as const;

export function SecurityPanel() {
  return (
    <>
      <SettingGroup title="Password">
        <SettingRow label="Password" sub="Last changed 3 months ago — strong">
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy hover:bg-gray-50 transition-colors">
            Change password
          </button>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Two-factor authentication">
        <SettingRow
          label="Authenticator app"
          sub="Active — Google Authenticator"
          right={<Badge variant="available">Enabled</Badge>}
        >
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            Reconfigure
          </button>
        </SettingRow>
        <SettingRow label="SMS backup" sub="Sends a code to +1 (617) •••• 0184">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Recovery codes" sub="10 of 10 unused — store somewhere safe">
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            View codes
          </button>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Active sessions" last>
        {SESSIONS.map((s, i) => (
          <SettingRow
            key={i}
            label={s.device}
            sub={`${s.loc} · ${s.time}`}
            right={s.current ? <Badge variant="available">This device</Badge> : undefined}
          >
            {!s.current && (
              <button className="px-3.5 py-2 border border-error/40 text-error rounded-md font-sans text-[13px] hover:bg-error-bg transition-colors">
                Sign out
              </button>
            )}
          </SettingRow>
        ))}
        <div className="mt-3">
          <button className="px-4 py-2 border border-error/40 text-error rounded-md font-sans text-[13px] font-medium hover:bg-error-bg transition-colors">
            Sign out of all other sessions
          </button>
        </div>
      </SettingGroup>
    </>
  );
}
