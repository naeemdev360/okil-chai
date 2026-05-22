import type { NotificationResponse, PaginatedNotificationsResponse } from '@repo/shared';
import type { NotificationType } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';

export const NOTIFICATIONS_SERVICE = Symbol('NOTIFICATIONS_SERVICE');
export const NOTIFICATIONS_REPOSITORY = Symbol('NOTIFICATIONS_REPOSITORY');

// ── Repository types ──────────────────────────────────────────────────────────

export interface NotificationRow {
  readonly id: string;
  readonly userId: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly payload: string | null;
  readonly isRead: boolean;
  readonly createdAt: Date;
}

export interface InsertNotificationData {
  readonly userId: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly payload?: Record<string, unknown>;
}

export interface INotificationsRepository {
  insert(data: InsertNotificationData): Promise<NotificationRow>;
  findByUserId(userId: string, query: PaginationQuery): Promise<{ items: NotificationRow[]; total: number }>;
  countUnread(userId: string): Promise<number>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

// ── Service contract ──────────────────────────────────────────────────────────

export interface INotificationsService {
  create(data: InsertNotificationData): Promise<NotificationResponse>;
  getForUser(userId: string, query: PaginationQuery): Promise<PaginatedNotificationsResponse>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
