export type NotifType =
  | 'booking-request'
  | 'booking-confirmed'
  | 'message'
  | 'payout'
  | 'review'
  | 'system'
  | 'reminder'
  | 'milestone';

export type NotifFilterKey = 'all' | 'unread' | 'booking-request' | 'message' | 'payout' | 'system';

export interface NotifItem {
  readonly id: number;
  readonly type: NotifType;
  unread: boolean;
  readonly time: string;
  readonly title: string;
  readonly body: string;
  readonly actions: readonly string[];
}
