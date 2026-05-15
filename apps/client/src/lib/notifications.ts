import type { NotificationItem, NotificationType } from '@repo/ui';

export type { NotificationType };

export type TabId = 'all' | 'unread' | 'booking' | 'message' | 'payment';

export const NOTIFICATIONS: readonly NotificationItem[] = [
  { id: '1', type: 'booking',  title: 'Booking Confirmed',                isRead: false, time: '2 min ago',   description: 'Your consultation with James Sullivan on Tue, May 5 at 10:00 AM has been confirmed.',                                              actionLabel: 'View Booking',      actionHref: '/appointments/1' },
  { id: '2', type: 'message',  title: 'New Message from James Sullivan',  isRead: false, time: '18 min ago',  description: "I'll review your documents before our call on Tuesday. Please upload them via the Documents tab.",                               actionLabel: 'Reply',             actionHref: '/messages/1' },
  { id: '3', type: 'reminder', title: 'Consultation Tomorrow — 10:00 AM', isRead: false, time: '1 hour ago',  description: 'Your video call with James Sullivan (Criminal Law) is tomorrow at 10:00 AM. Test your camera and mic ahead of time.',             actionLabel: 'Prepare',           actionHref: '/appointments/1' },
  { id: '4', type: 'review',   title: 'How was your consultation?',       isRead: true,  time: '2 hours ago', description: 'Your session with David Park is complete. Leave a review to help other clients and earn a $10 credit.',                          actionLabel: 'Leave Review',      actionHref: '/reviews/new' },
  { id: '5', type: 'payment',  title: 'Payment Receipt — $204.00',        isRead: true,  time: '3 hours ago', description: 'Your payment of $204.00 for the consultation with James Sullivan has been processed. Ref: LC-2026-48812.',                      actionLabel: 'Download Receipt',  actionHref: '/payments/5' },
  { id: '6', type: 'booking',  title: 'Booking Reminder — Fri, May 9',    isRead: true,  time: '1 day ago',   description: 'You have a consultation with Sarah Chen (Family Law) on Friday, May 9 at 2:00 PM. Add to your calendar.',                       actionLabel: 'View Booking',      actionHref: '/appointments/2' },
  { id: '7', type: 'message',  title: 'Reply from Sarah Chen',            isRead: true,  time: '2 days ago',  description: "Thanks for sending those documents. I'll review them before our Friday session and come prepared with questions.",               actionLabel: 'Reply',             actionHref: '/messages/2' },
  { id: '8', type: 'booking',  title: 'Booking Request Approved',         isRead: true,  time: '3 days ago',  description: 'Your booking request with Marcus Rivera (Immigration Law) for Mon, May 12 at 11:00 AM has been approved.',                     actionLabel: 'View Booking',      actionHref: '/appointments/3' },
];

const BOOKING_TYPES = new Set<NotificationItem['type']>(['booking', 'reminder']);

const TAB_PREDICATES: Record<TabId, (n: NotificationItem) => boolean> = {
  all:     () => true,
  unread:  (n) => !n.isRead,
  booking: (n) => BOOKING_TYPES.has(n.type),
  message: (n) => n.type === 'message',
  payment: (n) => n.type === 'payment',
};

export function filterNotifications(
  items: readonly NotificationItem[],
  tab: TabId,
  readIds: ReadonlySet<string>,
): readonly NotificationItem[] {
  return items
    .map((n) => ({ ...n, isRead: n.isRead || readIds.has(n.id) }))
    .filter(TAB_PREDICATES[tab]);
}

export function countByTab(
  items: readonly NotificationItem[],
  readIds: ReadonlySet<string>,
): Record<TabId, number> {
  const mapped = items.map((n) => ({ ...n, isRead: n.isRead || readIds.has(n.id) }));
  return {
    all:     mapped.length,
    unread:  mapped.filter(TAB_PREDICATES.unread).length,
    booking: mapped.filter(TAB_PREDICATES.booking).length,
    message: mapped.filter(TAB_PREDICATES.message).length,
    payment: mapped.filter(TAB_PREDICATES.payment).length,
  };
}
