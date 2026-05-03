'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, NotificationPreview } from '@okil-chai/ui';
import type { NotificationItem } from '@okil-chai/ui';
import { Role } from '@okil-chai/shared';
import { Bell } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { getPortalUrl } from '../../lib/auth/portal-routes';

interface NotificationBellProps {
  readonly role: Role | null;
}

const NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    description: 'Your consultation with James Sullivan on Tue, May 5 at 10:00 AM has been confirmed.',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message from James Sullivan',
    description: "I'll review your documents before our call on Tuesday. Please upload them via the Documents tab.",
    time: '18 min ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Consultation Tomorrow — 10:00 AM',
    description: 'Your video call with James Sullivan (Criminal Law) is tomorrow at 10:00 AM. Test your camera ahead of time.',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'review',
    title: 'How was your consultation?',
    description: 'Your session with David Park is complete. Leave a review to help other clients.',
    time: '2 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Receipt — $204.00',
    description: 'Your payment of $204.00 for the consultation with James Sullivan has been processed.',
    time: '3 hours ago',
    isRead: true,
  },
];

export function NotificationBell({ role }: NotificationBellProps) {
  const t      = useTranslations('nav.user');
  const locale = useLocale();
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());

  const items       = NOTIFICATIONS.map((n) => ({ ...n, isRead: n.isRead || readIds.has(n.id) }));
  const unreadCount = items.filter((n) => !n.isRead).length;
  const portalUrl   = role ? `${getPortalUrl(role)}/notifications` : `/${locale}`;
  const markAllRead = () => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t('openNotifications')}
          className="relative p-2 rounded-md text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors duration-200"
        >
          <Bell className="size-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gold text-navy text-[10px] font-bold px-1 leading-none">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-navy text-sm">{t('notifications')}</span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-gold text-navy">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="font-sans text-xs text-gray-500 hover:text-navy transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
          {items.map((n) => <NotificationPreview key={n.id} notification={n} />)}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 text-center">
          <Link
            href={portalUrl}
            className="font-sans text-sm font-medium text-navy underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
