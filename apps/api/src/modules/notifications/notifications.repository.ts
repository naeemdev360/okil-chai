import { Inject, Injectable } from '@nestjs/common';
import type { NotificationType } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';
import { and, count, desc, eq } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { notifications } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination } from '../../common/utils/pagination.util';
import type {
  INotificationsRepository,
  InsertNotificationData,
  NotificationRow,
} from './interfaces/notifications.interfaces';

@Injectable()
export class NotificationsRepository extends BaseRepository implements INotificationsRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async insert(data: InsertNotificationData): Promise<NotificationRow> {
    const [row] = await this.db
      .insert(notifications)
      .values({
        userId: data.userId,
        type: data.type,
        title: data.title,
        body: data.body,
        payload: data.payload ? JSON.stringify(data.payload) : null,
      })
      .returning({
        id: notifications.id,
        userId: notifications.userId,
        type: notifications.type,
        title: notifications.title,
        body: notifications.body,
        payload: notifications.payload,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
      });

    return row! as NotificationRow;
  }

  async findByUserId(
    userId: string,
    query: PaginationQuery,
  ): Promise<{ items: NotificationRow[]; total: number }> {
    const { offset, limit } = buildPagination(query);

    const [countResult, rows] = await Promise.all([
      this.db
        .select({ total: count() })
        .from(notifications)
        .where(eq(notifications.userId, userId)),
      this.db
        .select({
          id: notifications.id,
          userId: notifications.userId,
          type: notifications.type,
          title: notifications.title,
          body: notifications.body,
          payload: notifications.payload,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    return {
      items: rows as NotificationRow[],
      total: countResult[0]?.total ?? 0,
    };
  }

  async countUnread(userId: string): Promise<number> {
    const [result] = await this.db
      .select({ total: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return result?.total ?? 0;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }
}
