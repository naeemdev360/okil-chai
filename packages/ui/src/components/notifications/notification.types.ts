export type NotificationType = 'booking' | 'message' | 'reminder' | 'review' | 'payment' | 'cancelled' | 'system';

export interface NotificationItem {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly description: string;
  readonly time: string;
  readonly isRead: boolean;
  readonly actionLabel?: string;
  readonly actionHref?: string;
}
