import { useState } from 'react';
import { Check } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { PageHeader } from '../../components/ui/PageHeader';
import { AccountPanel }       from '../../components/features/settings/panels/AccountPanel';
import { SecurityPanel }      from '../../components/features/settings/panels/SecurityPanel';
import { NotifPrefsPanel }    from '../../components/features/settings/panels/NotifPrefsPanel';
import { FeesPanel }          from '../../components/features/settings/panels/FeesPanel';
import { IntegrationsPanel }  from '../../components/features/settings/panels/IntegrationsPanel';
import { SubscriptionPanel }  from '../../components/features/settings/panels/SubscriptionPanel';
import { DangerPanel }        from '../../components/features/settings/panels/DangerPanel';
import {
  PrivacyPanel,
  HoursPanel,
  ConsultPanel,
  TaxPanel,
  PayoutsPanel,
  SupportPanel,
} from '../../components/features/settings/panels/SimpleSettingsPanels';
import {
  SETTINGS_SECTIONS,
  SETTINGS_DESCRIPTIONS,
} from './settings.constants';

const PANEL_MAP: Record<string, React.ReactNode> = {
  account:       <AccountPanel />,
  security:      <SecurityPanel />,
  notifications: <NotifPrefsPanel />,
  privacy:       <PrivacyPanel />,
  hours:         <HoursPanel />,
  fees:          <FeesPanel />,
  consultation:  <ConsultPanel />,
  integrations:  <IntegrationsPanel />,
  subscription:  <SubscriptionPanel />,
  tax:           <TaxPanel />,
  payouts:       <PayoutsPanel />,
  support:       <SupportPanel />,
  danger:        <DangerPanel />,
};

export function SettingsPage() {
  const [activeKey, setActiveKey] = useState('account');
  const allItems = SETTINGS_SECTIONS.flatMap(g => g.items);
  const current = allItems.find(i => i.key === activeKey) ?? allItems[0]!;

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Settings"
          subtitle="Manage your account, practice, and platform preferences"
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] gap-4 items-start">
        {/* Sub-nav */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 lg:sticky lg:top-20">
          {SETTINGS_SECTIONS.map((group, gi) => (
            <div key={group.group} className={gi < SETTINGS_SECTIONS.length - 1 ? 'mb-3' : ''}>
              <div className="px-3 py-1.5 font-sans text-[10px] text-gray-400 tracking-[0.1em] uppercase font-bold">
                {group.group}
              </div>
              {group.items.map(item => {
                const active = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveKey(item.key)}
                    className={[
                      'flex items-center gap-2.5 w-full px-3 py-2 rounded-md mb-0.5 font-sans text-[13px] text-left transition-all border-l-[3px]',
                      active
                        ? 'bg-cream text-navy font-semibold border-l-gold'
                        : 'text-gray-600 font-medium hover:bg-gray-50 border-l-transparent',
                      item.isDanger ? 'text-error hover:bg-error-bg' : '',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-heading text-[19px] font-semibold text-navy capitalize">
                {current.label}
              </h3>
              <div className="font-sans text-[12px] text-gray-600 mt-0.5">
                {SETTINGS_DESCRIPTIONS[activeKey] ?? ''}
              </div>
            </div>
            {activeKey !== 'danger' && (
              <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <Check size={14} strokeWidth={1.5} /> Save changes
              </button>
            )}
          </div>
          <div className="px-7 py-6">
            {PANEL_MAP[activeKey]}
          </div>
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}
