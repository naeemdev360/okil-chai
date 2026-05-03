import type { NotificationItem, PrefSection, TabItem } from '@okil-chai/ui';
import { cn, NotificationPreferencesPanel, NotificationRow, TabBar } from '@okil-chai/ui';
import { Bell, Check, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  countByTab,
  filterNotifications,
  NOTIFICATIONS,
  type TabId,
} from '../../lib/notifications';

const TABS: readonly TabItem[] = [
  { id: 'all',     label: 'All'      },
  { id: 'unread',  label: 'Unread'   },
  { id: 'booking', label: 'Bookings' },
  { id: 'message', label: 'Messages' },
  { id: 'payment', label: 'Payments' },
];

const PREF_SECTIONS: readonly PrefSection[] = [
  {
    title: 'Bookings & Appointments',
    items: [
      'Booking confirmed',
      'Booking cancelled / rescheduled',
      '24h reminder before consultation',
      'Post-consultation review prompt',
    ],
  },
  {
    title: 'Messages',
    items: ['New message from lawyer', 'Message read receipts'],
  },
  {
    title: 'Payments',
    items: ['Payment receipt', 'Refund processed', 'Subscription renewal'],
  },
  {
    title: 'Platform',
    items: ['Profile verification updates', 'Security alerts', 'Product updates & tips'],
  },
];

type PrefKey = string;

function buildDefaultPrefs(): Record<PrefKey, boolean> {
  const defaults: Record<PrefKey, boolean> = {};
  for (const section of PREF_SECTIONS) {
    for (const item of section.items) {
      defaults[item] = true;
    }
  }
  return defaults;
}

function renderLink(href: string, label: string) {
  return (
    <Link
      to={href}
      className="inline-block mt-[10px] font-sans text-[13px] font-semibold text-navy underline underline-offset-[3px] hover:opacity-70 transition-opacity"
    >
      {label} →
    </Link>
  );
}

function EmptyState({ tab }: { readonly tab: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-50 mx-auto mb-4 flex items-center justify-center">
        <Bell className="size-6 text-gray-400" aria-hidden="true" />
      </div>
      <p className="font-heading text-lg font-semibold text-navy mb-1.5">All caught up!</p>
      <p className="font-sans text-sm text-gray-600">
        No {tab !== 'all' ? `${tab} ` : ''}notifications right now.
      </p>
    </div>
  );
}

export function NotificationsPage() {
  const [activeTab,  setActiveTab]  = useState<TabId>('all');
  const [readIds,    setReadIds]    = useState<ReadonlySet<string>>(new Set());
  const [showPrefs,  setShowPrefs]  = useState(false);
  const [prefs,      setPrefs]      = useState<Record<PrefKey, boolean>>(buildDefaultPrefs);
  const [savedPrefs, setSavedPrefs] = useState<Record<PrefKey, boolean>>(buildDefaultPrefs);

  const counts      = countByTab(NOTIFICATIONS, readIds);
  const items       = filterNotifications(NOTIFICATIONS, activeTab, readIds) as NotificationItem[];
  const markAll     = () => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  const setPref     = (key: PrefKey, val: boolean) => setPrefs((p) => ({ ...p, [key]: val }));
  const savePrefs   = () => { setSavedPrefs(prefs); setShowPrefs(false); };
  const cancelPrefs = () => { setPrefs(savedPrefs); setShowPrefs(false); };

  const tabsWithCounts: readonly TabItem[] = TABS.map((t) => ({
    ...t,
    count: counts[t.id as TabId],
  }));

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="max-w-[880px] mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="font-heading text-[32px] font-bold text-navy leading-tight mb-1">
              Notifications
            </h1>
            <p className="font-sans text-sm text-gray-600">
              {counts.unread > 0 ? (
                <>
                  <strong className="text-navy">{counts.unread} unread</strong>
                  {' '}notification{counts.unread !== 1 ? 's' : ''}
                </>
              ) : (
                'All caught up!'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {counts.unread > 0 && (
              <button
                onClick={markAll}
                className="inline-flex items-center gap-1.5 px-[14px] py-[9px] rounded-md border-[1.5px] border-gray-200 bg-white font-sans text-[13px] font-medium text-navy hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Check className="size-3.5" aria-hidden="true" />
                Mark all read
              </button>
            )}
            <button
              onClick={() => setShowPrefs((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1.5 px-[14px] py-[9px] rounded-md border-[1.5px] font-sans text-[13px] font-medium transition-colors cursor-pointer',
                showPrefs
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy border-gray-200 hover:bg-gray-50',
              )}
            >
              <Settings
                className={cn('size-3.5', showPrefs ? 'text-white' : 'text-navy')}
                aria-hidden="true"
              />
              Preferences
            </button>
          </div>
        </div>

        {/* Preferences panel */}
        {showPrefs && (
          <div className="mb-6">
            <NotificationPreferencesPanel
              sections={PREF_SECTIONS}
              prefs={prefs}
              onPrefChange={setPref}
              onSave={savePrefs}
              onCancel={cancelPrefs}
            />
          </div>
        )}

        {/* Tabs + list card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <TabBar
            items={tabsWithCounts}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
            variant="light"
            className="border-b border-gray-100 px-2"
          />

          {items.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            items.map((n) => (
              <NotificationRow key={n.id} notification={n} renderLink={renderLink} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
