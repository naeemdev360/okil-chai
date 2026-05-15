export interface SettingsNavItem {
  readonly key: string;
  readonly label: string;
  readonly icon: string;
  readonly isDanger?: boolean;
}

export interface SettingsNavGroup {
  readonly group: string;
  readonly items: readonly SettingsNavItem[];
}

export const SETTINGS_SECTIONS: readonly SettingsNavGroup[] = [
  {
    group: 'Personal',
    items: [
      { key: 'account',       label: 'Account',            icon: 'user-check' },
      { key: 'security',      label: 'Security',           icon: 'lock'       },
      { key: 'notifications', label: 'Notifications',      icon: 'bell'       },
      { key: 'privacy',       label: 'Privacy',            icon: 'shield'     },
    ],
  },
  {
    group: 'Practice',
    items: [
      { key: 'hours',         label: 'Working hours',      icon: 'clock'      },
      { key: 'fees',          label: 'Fees & rates',       icon: 'dollar'     },
      { key: 'consultation',  label: 'Consultation prefs', icon: 'video'      },
      { key: 'integrations',  label: 'Integrations',       icon: 'plus'       },
    ],
  },
  {
    group: 'Billing',
    items: [
      { key: 'subscription',  label: 'Plan & billing',     icon: 'sparkle'    },
      { key: 'tax',           label: 'Tax information',    icon: 'file'       },
      { key: 'payouts',       label: 'Payout methods',     icon: 'credit'     },
    ],
  },
  {
    group: 'Account',
    items: [
      { key: 'support',       label: 'Help & support',     icon: 'help'       },
      { key: 'danger',        label: 'Danger zone',        icon: 'x',  isDanger: true },
    ],
  },
];

export const SETTINGS_DESCRIPTIONS: Record<string, string> = {
  account:       'Personal info that appears across the platform',
  security:      'Password, 2FA, and active sessions',
  notifications: 'Choose how and when to be alerted',
  privacy:       'Control visibility and data sharing',
  hours:         'Default working hours by day',
  fees:          'Hourly rate and service-specific pricing',
  consultation:  'Defaults for video, phone, and in-person sessions',
  integrations:  'Connect Google Calendar, Stripe, Drive, and more',
  subscription:  'Your LegalConnect Pro plan',
  tax:           'W-9 status and tax-form delivery',
  payouts:       'Where your earnings get deposited',
  support:       'Get help from the LegalConnect team',
  danger:        'Permanent account actions',
};
