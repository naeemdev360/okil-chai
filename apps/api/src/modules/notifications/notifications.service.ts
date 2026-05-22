import { Inject, Injectable } from '@nestjs/common';
import type { NotificationResponse, PaginatedNotificationsResponse } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';
import { buildPagination, buildPaginationMeta } from '../../common/utils/pagination.util';
import type {
  INotificationsRepository,
  INotificationsService,
  InsertNotificationData,
  NotificationRow,
} from './interfaces/notifications.interfaces';
import { NOTIFICATIONS_REPOSITORY } from './interfaces/notifications.interfaces';

@Injectable()
export class NotificationsService implements INotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async create(data: InsertNotificationData): Promise<NotificationResponse> {
    const row = await this.notificationsRepository.insert(data);
    return this.toResponse(row);
  }

  async getForUser(
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginatedNotificationsResponse> {
    const { page, limit } = buildPagination(query);
    const [{ items, total }, unreadCount] = await Promise.all([
      this.notificationsRepository.findByUserId(userId, query),
      this.notificationsRepository.countUnread(userId),
    ]);

    return {
      data: items.map((r) => this.toResponse(r)),
      meta: buildPaginationMeta(total, page, limit),
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    return this.notificationsRepository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return this.notificationsRepository.markAllAsRead(userId);
  }

  private toResponse(row: NotificationRow): NotificationResponse {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      payload: row.payload ? (JSON.parse(row.payload) as Record<string, unknown>) : null,
      isRead: row.isRead,
      createdAt: row.createdAt,
    };
  }
}
