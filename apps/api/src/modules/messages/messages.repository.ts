import { Inject, Injectable } from '@nestjs/common';
import type { PaginationQuery } from '@repo/shared';
import { and, count, desc, eq, or, sql } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { messages, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination } from '../../common/utils/pagination.util';
import type {
  ConversationRow,
  IMessagesRepository,
  InsertMessageData,
  MessageRow,
} from './interfaces/messages.interfaces';

@Injectable()
export class MessagesRepository extends BaseRepository implements IMessagesRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async insert(data: InsertMessageData): Promise<MessageRow> {
    const [row] = await this.db
      .insert(messages)
      .values({
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        appointmentId: data.appointmentId ?? null,
      })
      .returning({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        isRead: messages.isRead,
        readAt: messages.readAt,
        appointmentId: messages.appointmentId,
        createdAt: messages.createdAt,
      });

    return row!;
  }

  async findThread(
    userId: string,
    otherUserId: string,
    query: PaginationQuery,
  ): Promise<{ items: MessageRow[]; total: number }> {
    const { offset, limit } = buildPagination(query);

    const threadCondition = or(
      and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
      and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId)),
    );

    const [countResult, rows] = await Promise.all([
      this.db.select({ total: count() }).from(messages).where(threadCondition),
      this.db
        .select({
          id: messages.id,
          senderId: messages.senderId,
          receiverId: messages.receiverId,
          content: messages.content,
          isRead: messages.isRead,
          readAt: messages.readAt,
          appointmentId: messages.appointmentId,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(threadCondition)
        .orderBy(messages.createdAt)
        .limit(limit)
        .offset(offset),
    ]);

    return { items: rows, total: countResult[0]?.total ?? 0 };
  }

  async findConversations(userId: string): Promise<ConversationRow[]> {
    const result = await this.db.execute<{
      other_user_id: string;
      other_user_first_name: string;
      other_user_last_name: string;
      other_user_avatar_url: string | null;
      last_message_id: string;
      last_message_sender_id: string;
      last_message_receiver_id: string;
      last_message_content: string;
      last_message_is_read: boolean;
      last_message_read_at: string | null;
      last_message_appointment_id: string | null;
      last_message_created_at: string;
      unread_count: string;
    }>(sql`
      WITH ranked AS (
        SELECT
          m.id,
          m.sender_id,
          m.receiver_id,
          m.content,
          m.is_read,
          m.read_at,
          m.appointment_id,
          m.created_at,
          CASE
            WHEN m.sender_id = ${userId}::uuid THEN m.receiver_id
            ELSE m.sender_id
          END AS other_user_id,
          ROW_NUMBER() OVER (
            PARTITION BY CASE
              WHEN m.sender_id = ${userId}::uuid THEN m.receiver_id
              ELSE m.sender_id
            END
            ORDER BY m.created_at DESC
          ) AS rn
        FROM ${messages} m
        WHERE m.sender_id = ${userId}::uuid OR m.receiver_id = ${userId}::uuid
      ),
      latest AS (SELECT * FROM ranked WHERE rn = 1)
      SELECT
        l.other_user_id,
        u.first_name  AS other_user_first_name,
        u.last_name   AS other_user_last_name,
        u.avatar_url  AS other_user_avatar_url,
        l.id          AS last_message_id,
        l.sender_id   AS last_message_sender_id,
        l.receiver_id AS last_message_receiver_id,
        l.content     AS last_message_content,
        l.is_read     AS last_message_is_read,
        l.read_at     AS last_message_read_at,
        l.appointment_id AS last_message_appointment_id,
        l.created_at  AS last_message_created_at,
        (
          SELECT COUNT(*)::int
          FROM ${messages} m2
          WHERE m2.sender_id = l.other_user_id
            AND m2.receiver_id = ${userId}::uuid
            AND m2.is_read = false
        ) AS unread_count
      FROM latest l
      INNER JOIN ${users} u ON u.id = l.other_user_id
      ORDER BY l.created_at DESC
    `);

    return result.rows.map((r) => ({
      otherUserId: r.other_user_id,
      otherUserFirstName: r.other_user_first_name,
      otherUserLastName: r.other_user_last_name,
      otherUserAvatarUrl: r.other_user_avatar_url,
      lastMessageId: r.last_message_id,
      lastMessageSenderId: r.last_message_sender_id,
      lastMessageReceiverId: r.last_message_receiver_id,
      lastMessageContent: r.last_message_content,
      lastMessageIsRead: r.last_message_is_read,
      lastMessageReadAt: r.last_message_read_at ? new Date(r.last_message_read_at) : null,
      lastMessageAppointmentId: r.last_message_appointment_id,
      lastMessageCreatedAt: new Date(r.last_message_created_at),
      unreadCount: Number(r.unread_count),
    }));
  }

  async markThreadAsRead(userId: string, otherUserId: string): Promise<void> {
    await this.db
      .update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.receiverId, userId),
          eq(messages.isRead, false),
        ),
      );
  }
}
