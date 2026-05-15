export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'declined';
export type BookingType = 'video' | 'phone' | 'in-person';

export interface BookingAttachment {
  readonly name: string;
  readonly size: string;
}

export interface Booking {
  readonly id: number;
  readonly day: 'today' | 'tomorrow' | 'wed' | 'past';
  readonly initials: string;
  readonly client: string;
  readonly email: string;
  readonly phone: string;
  readonly type: BookingType;
  readonly topic: string;
  readonly requestedFor: string;
  readonly timeShort: string;
  readonly ampm: string;
  readonly duration: string;
  readonly fee: number;
  status: BookingStatus;
  readonly priority?: 'urgent';
  readonly area: string;
  readonly memberSince: string;
  readonly pastBookings: number;
  readonly pastWithYou: number;
  readonly location: string;
  readonly brief: string;
  readonly submitted?: string;
  readonly attachments?: readonly BookingAttachment[];
  readonly declinedAt?: string;
  readonly declineReason?: string;
}

export interface Earnings {
  readonly thisMonth: number;
  readonly lastMonth: number;
  readonly pending: number;
  readonly lifetime: number;
  readonly payoutDate: string;
}

export interface Review {
  readonly name: string;
  readonly initials: string;
  readonly rating: number;
  readonly area: string;
  readonly date: string;
  readonly text: string;
  readonly reply?: string;
}

export interface Message {
  readonly from: 'me' | 'them';
  readonly text?: string;
  readonly time?: string;
  readonly typing?: boolean;
  readonly system?: boolean;
}

export interface SharedFile {
  readonly name: string;
  readonly size: string;
}

export interface MessageThread {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly online: boolean;
  readonly unread: number;
  readonly lastTime: string;
  readonly area: string;
  readonly preview: string;
  readonly caseRef: string;
  readonly caseTitle: string;
  readonly caseStatus: string;
  readonly nextConsult: string;
  readonly memberSince: string;
  readonly files: readonly SharedFile[];
  messages: Message[];
}

export interface Document {
  readonly name: string;
  readonly case: string;
  readonly modified: string;
  readonly size: string;
  readonly ext: string;
  readonly shared?: string;
}

export type AvailabilitySlotType = 'available' | 'booked' | 'blocked' | 'pending';

export interface AvailabilitySlot {
  readonly day: string;
  readonly start: number;
  readonly end: number;
  readonly type: AvailabilitySlotType;
  readonly client?: string;
  readonly topic?: string;
}

export interface MockData {
  bookings: Booking[];
  readonly earnings: Earnings;
  readonly reviews: readonly Review[];
  readonly threads: MessageThread[];
  readonly documents: readonly Document[];
  readonly availability: readonly AvailabilitySlot[];
  act: (id: number, status: BookingStatus) => void;
}

export interface Transaction {
  readonly id: number;
  readonly date: string;
  readonly client: string;
  readonly topic: string;
  readonly gross: number;
  readonly fee: number;
  readonly net: number;
  readonly status: 'completed' | 'pending';
}
