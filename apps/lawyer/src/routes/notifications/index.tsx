import { useState } from 'react';
import { Bell, Check, Settings } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { PageHeader } from '../../components/ui/PageHeader';
import { NotifRow } from '../../components/features/notifications/NotifRow';
import { NotifPreferencesCard } from '../../components/features/notifications/NotifPreferencesCard';
import { NotifQuietHoursCard } from '../../components/features/notifications/NotifQuietHoursCard';
import {
  INITIAL_NOTIF_ITEMS,
  NOTIF_FILTERS,
  isTodayTime,
} from './notifications.constants';
import type { NotifFilterKey, NotifItem } from './notifications.types';

export function NotificationsPage() {
  const [filter, setFilter] = useState<NotifFilterKey>('all');
  const [items, setItems] = useState<NotifItem[]>(INITIAL_NOTIF_ITEMS);

  const markAll = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));
  const markOne = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id));

  const visible = items.filter(n => {
    if (filter === 'all')    return true;
    if (filter === 'unread') return n.unread;
    return n.type === filter || (filter === 'booking-request' && n.type === 'booking-confirmed');
  });

  const todayItems   = visible.filter(n => isTodayTime(n.time));
  const earlierItems = visible.filter(n => !isTodayTime(n.time));
  const unreadCount  = items.filter(n => n.unread).length;

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `${unreadCount} unread · ${items.length} total` : `${items.length} total`}
          actions={
            <>
              <button
                onClick={markAll}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <Check size={14} /> Mark all as read
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <Settings size={14} /> Preferences
              </button>
            </>
          }
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4 items-start">
        {/* Main list */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Filter chips */}
          <div className="px-4 py-3.5 border-b border-gray-100 flex gap-1.5 flex-wrap">
            {NOTIF_FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={[
                    'px-3 py-1.5 rounded-full font-sans text-[12px] font-medium border transition-colors',
                    active ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-200 hover:border-navy/30',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div className="py-16 text-center">
              <Bell size={32} className="text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
              <div className="font-sans text-[14px] text-gray-600 mb-1">You're all caught up</div>
              <div className="font-sans text-[12px] text-gray-400">No notifications match this filter.</div>
            </div>
          ) : (
            [
              { label: 'Today',   list: todayItems },
              { label: 'Earlier', list: earlierItems },
            ].map(({ label, list }) =>
              list.length === 0 ? null : (
                <div key={label}>
                  <div className="px-5 py-2.5 bg-gray-50 font-sans text-[10px] text-gray-400 font-bold tracking-[0.1em] uppercase">
                    {label}
                  </div>
                  {list.map((n, i) => (
                    <NotifRow
                      key={n.id}
                      item={n}
                      divider={i > 0}
                      onAction={() => markOne(n.id)}
                      onDismiss={() => dismiss(n.id)}
                    />
                  ))}
                </div>
              )
            )
          )}
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-3">
          <NotifPreferencesCard />
          <NotifQuietHoursCard />
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}
