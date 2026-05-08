export type ConsultationType = 'video' | 'phone' | 'in-person';
export type AppointmentStatus = 'upcoming' | 'past' | 'cancelled';

export interface Appointment {
  readonly id: string;
  readonly lawyer: string;
  readonly spec: string;
  readonly initials: string;
  readonly date: string;
  readonly time: string;
  readonly type: ConsultationType;
  readonly status: AppointmentStatus;
  readonly fee: number;
  readonly when?: string;
  readonly hasReview?: boolean;
}

export interface SavedLawyer {
  readonly id: string;
  readonly name: string;
  readonly spec: string;
  readonly initials: string;
  readonly city: string;
  readonly rate: number;
  readonly rating: number;
  readonly count: number;
}

export interface Conversation {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly last: string;
  readonly time: string;
  readonly unread: number;
  readonly online: boolean;
}

export interface ChatMessage {
  readonly id: string;
  readonly from: 'me' | 'them';
  readonly text: string;
  readonly time: string;
}

export interface Document {
  readonly id: string;
  readonly name: string;
  readonly size: string;
  readonly shared: string | null;
  readonly date: string;
  readonly encrypted: boolean;
}

export interface Transaction {
  readonly id: string;
  readonly lawyer: string;
  readonly desc: string;
  readonly date: string;
  readonly amount: number;
  readonly status: 'paid' | 'refunded';
}

export const CURRENT_USER = {
  name: 'Rachel Morgan',
  email: 'rachel@example.com',
  initials: 'RM',
  upcomingCount: 3,
  unreadMessages: 2,
  stats: {
    totalConsultations: 7,
    hoursConsulted: '9.5',
    totalSpent: '$1,240',
    savedLawyers: 4,
  },
} as const;

export const NEXT_APPOINTMENT: Appointment = {
  id: 'appt-1',
  lawyer: 'James Sullivan',
  spec: 'Criminal Law',
  initials: 'JS',
  date: 'Tuesday, May 5',
  time: '10:00 AM',
  type: 'video',
  status: 'upcoming',
  fee: 180,
  when: '2 days away',
};

export const APPOINTMENTS: readonly Appointment[] = [
  NEXT_APPOINTMENT,
  { id: 'appt-2', lawyer: 'Maria González', spec: 'Family Law', initials: 'MG', date: 'Fri, May 9', time: '2:30 PM', type: 'phone', status: 'upcoming', fee: 120, when: 'in 5 days' },
  { id: 'appt-3', lawyer: 'Aisha Khan', spec: 'Immigration', initials: 'AK', date: 'Mon, May 12', time: '4:00 PM', type: 'in-person', status: 'upcoming', fee: 220, when: 'in 1 week' },
  { id: 'appt-4', lawyer: 'David Park', spec: 'Corporate Law', initials: 'DP', date: 'Apr 12 · 11:00 AM', time: '11:00 AM', type: 'video', status: 'past', fee: 180, hasReview: false },
  { id: 'appt-5', lawyer: 'James Sullivan', spec: 'Criminal Law', initials: 'JS', date: 'Mar 28 · 3:00 PM', time: '3:00 PM', type: 'video', status: 'past', fee: 180, hasReview: true },
];

export const UPCOMING_APPOINTMENTS: readonly Appointment[] = [
  { id: 'appt-2', lawyer: 'Maria González', spec: 'Family Law', initials: 'MG', date: 'Fri, May 9', time: '2:30 PM', type: 'phone', status: 'upcoming', fee: 120 },
  { id: 'appt-3', lawyer: 'Aisha Khan', spec: 'Immigration', initials: 'AK', date: 'Mon, May 12', time: '4:00 PM', type: 'in-person', status: 'upcoming', fee: 220 },
];

export const SAVED_LAWYERS: readonly SavedLawyer[] = [
  { id: 'l-1', name: 'James Sullivan', spec: 'Criminal Law', initials: 'JS', city: 'Dhaka', rate: 180, rating: 4.9, count: 142 },
  { id: 'l-2', name: 'Maria González', spec: 'Family Law', initials: 'MG', city: 'Chittagong', rate: 120, rating: 4.8, count: 98 },
  { id: 'l-3', name: 'Aisha Khan', spec: 'Immigration', initials: 'AK', city: 'Dhaka', rate: 220, rating: 5.0, count: 64 },
  { id: 'l-4', name: 'David Park', spec: 'Corporate Law', initials: 'DP', city: 'Dhaka', rate: 240, rating: 4.7, count: 215 },
];

export const CONVERSATIONS: readonly Conversation[] = [
  { id: 'conv-1', name: 'James Sullivan', initials: 'JS', last: "I'll review the documents before our call.", time: '2h', unread: 1, online: true },
  { id: 'conv-2', name: 'Maria González', initials: 'MG', last: 'See you Friday at 2:30!', time: '1d', unread: 0, online: false },
  { id: 'conv-3', name: 'Aisha Khan', initials: 'AK', last: 'I can help with your case. Are you available for a quick chat?', time: '3d', unread: 1, online: true },
];

export const CHAT_MESSAGES: readonly ChatMessage[] = [
  { id: 'm-1', from: 'them', text: 'Hi! Thanks for booking with me.', time: '10:14 AM' },
  { id: 'm-2', from: 'them', text: 'Could you share a brief outline of your case so I can prepare?', time: '10:14 AM' },
  { id: 'm-3', from: 'me', text: "Sure. It's a contract dispute with my landlord — I have all the lease docs and emails.", time: '11:02 AM' },
  { id: 'm-4', from: 'them', text: "Perfect. I'll review the documents before our call. See you Tuesday at 10.", time: '11:08 AM' },
];

export const DOCUMENTS: readonly Document[] = [
  { id: 'd-1', name: 'Lease Agreement.pdf', size: '2.4 MB', shared: 'James Sullivan', date: 'Apr 22, 2026', encrypted: true },
  { id: 'd-2', name: 'Email correspondence.pdf', size: '890 KB', shared: 'James Sullivan', date: 'Apr 22, 2026', encrypted: true },
  { id: 'd-3', name: 'Passport scan.jpg', size: '1.1 MB', shared: 'Aisha Khan', date: 'Apr 18, 2026', encrypted: true },
  { id: 'd-4', name: 'Marriage certificate.pdf', size: '420 KB', shared: null, date: 'Apr 10, 2026', encrypted: true },
];

export const TRANSACTIONS: readonly Transaction[] = [
  { id: 't-1', lawyer: 'James Sullivan', desc: 'Criminal Law Consultation · 60 min', date: 'Apr 22, 2026', amount: 180, status: 'paid' },
  { id: 't-2', lawyer: 'Maria González', desc: 'Family Law Consultation · 45 min', date: 'Apr 8, 2026', amount: 120, status: 'paid' },
  { id: 't-3', lawyer: 'David Park', desc: 'Corporate Law Consultation · 60 min', date: 'Mar 18, 2026', amount: 180, status: 'refunded' },
];

export const ACTIVITY_ITEMS = [
  { icon: 'check-circle', colorClass: 'text-success bg-success-bg', text: 'Consultation with David Park completed', sub: 'Corporate Law · Apr 22, 2026', action: 'Leave Review', actionRoute: '/appointments' },
  { icon: 'message', colorClass: 'text-gold bg-gold-pale', text: 'New message from James Sullivan', sub: '"I\'ll review the documents before our call."', action: 'Reply', actionRoute: '/messages' },
  { icon: 'file', colorClass: 'text-navy-light bg-gray-100', text: 'Document uploaded successfully', sub: 'Lease Agreement.pdf · Shared with James Sullivan', action: 'View', actionRoute: '/documents' },
  { icon: 'credit-card', colorClass: 'text-success bg-success-bg', text: 'Payment confirmed', sub: '$120 · Family Law Consultation · Apr 8', action: 'Receipt', actionRoute: '/payments' },
] as const;
