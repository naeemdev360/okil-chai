import type { NotifFilterKey, NotifItem, NotifType } from './notifications.types';

export const NOTIF_FILTERS: { key: NotifFilterKey; label: string }[] = [
  { key: 'all',             label: 'All' },
  { key: 'unread',          label: 'Unread' },
  { key: 'booking-request', label: 'Bookings' },
  { key: 'message',         label: 'Messages' },
  { key: 'payout',          label: 'Payouts' },
  { key: 'system',          label: 'System' },
];

export const NOTIF_PREFS = [
  { k: 'booking-req', label: 'Booking requests', push: true,  email: true  },
  { k: 'msg',         label: 'Client messages',  push: true,  email: false },
  { k: 'review',      label: 'New reviews',      push: true,  email: false },
  { k: 'payout',      label: 'Payouts',          push: false, email: true  },
  { k: 'system',      label: 'Platform updates', push: false, email: false },
] as const;

export const INITIAL_NOTIF_ITEMS: NotifItem[] = [
  { id: 1,  type: 'booking-request'   as NotifType, unread: true,  time: '12 min ago',  title: 'New booking request',                    body: 'Marcus Pham requested a video consultation tomorrow at 10:00 AM — Immigration case (RFE response).', actions: ['Accept', 'Decline', 'View'] },
  { id: 2,  type: 'message'           as NotifType, unread: true,  time: '38 min ago',  title: 'Marcus Pham sent a message',              body: '"Let me know if you need anything else from me before tomorrow."', actions: ['Reply'] },
  { id: 3,  type: 'payout'            as NotifType, unread: true,  time: '1 hour ago',  title: 'Payout scheduled',                       body: 'A payout of $1,620.00 will arrive in your Bank of America account on Apr 30.', actions: ['View transactions'] },
  { id: 4,  type: 'review'            as NotifType, unread: true,  time: '2 hours ago', title: 'Rachel Martinez left you a 5-star review',body: '"Incredibly clear and patient. James took time to walk me through every option without rushing or talking down to me."', actions: ['Reply'] },
  { id: 5,  type: 'system'            as NotifType, unread: true,  time: '3 hours ago', title: 'Document needs your signature',           body: 'Motion to dismiss draft (CASE-2026-0421) is ready for your e-signature.', actions: ['Sign now'] },
  { id: 6,  type: 'reminder'          as NotifType, unread: true,  time: '4 hours ago', title: 'Upcoming consultation in 1 hour',         body: 'Rachel Martinez — video call at 2:00 PM. Pre-trial defense consultation.', actions: ['Join early', 'View prep notes'] },
  { id: 7,  type: 'booking-confirmed' as NotifType, unread: true,  time: 'Yesterday',   title: 'Yvonne Tran confirmed her appointment',   body: 'In-person consultation today at 6:00 PM has been confirmed and pre-paid.', actions: ['View'] },
  { id: 8,  type: 'system'            as NotifType, unread: false, time: 'Yesterday',   title: 'Profile completeness up to 92%',          body: "You're 8% away from the highest tier. Add a CV to unlock priority placement in search results.", actions: ['Complete profile'] },
  { id: 9,  type: 'message'           as NotifType, unread: false, time: '2 days ago',  title: 'David Kim sent a message',                body: '"The other side sent revisions — see attached."', actions: ['Reply'] },
  { id: 10, type: 'milestone'         as NotifType, unread: false, time: '3 days ago',  title: "You've crossed 4.9★ average",             body: 'Congratulations — you are now in the top 5% of lawyers on LegalConnect this quarter.', actions: [] },
  { id: 11, type: 'payout'            as NotifType, unread: false, time: 'Apr 23',      title: 'Payout completed',                        body: '$1,284.00 was deposited to your Bank of America account ending in 4421.', actions: ['View receipt'] },
  { id: 12, type: 'system'            as NotifType, unread: false, time: 'Apr 22',      title: 'Security tip',                            body: 'Two-factor authentication is enabled. Last login: Boston, MA · Chrome on macOS.', actions: [] },
];

export function isTodayTime(time: string): boolean {
  return /^(just now|\d+ (min|minutes?|hours?) ago)$/.test(time);
}
