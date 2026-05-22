import type {
  ConversationSummary,
  MessageResponse,
  PaginatedMessagesResponse,
} from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';

export const MESSAGES_SERVICE = Symbol('MESSAGES_SERVICE');
export const MESSAGES_REPOSITORY = Symbol('MESSAGES_REPOSITORY');

// ── Repository types ──────────────────────────────────────────────────────────

export interface MessageRow {
  readonly id: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly content: string;
  readonly isRead: boolean;
  readonly readAt: Date | null;
  readonly appointmentId: string | null;
  readonly createdAt: Date;
}

export interface ConversationRow {
  readonly otherUserId: string;
  readonly otherUserFirstName: string;
  readonly otherUserLastName: string;
  readonly otherUserAvatarUrl: string | null;
  readonly lastMessageId: string;
  readonly lastMessageSenderId: string;
  readonly lastMessageReceiverId: string;
  readonly lastMessageContent: string;
  readonly lastMessageIsRead: boolean;
  readonly lastMessageReadAt: Date | null;
  readonly lastMessageAppointmentId: string | null;
  readonly lastMessageCreatedAt: Date;
  readonly unreadCount: number;
}

export interface InsertMessageData {
  readonly senderId: string;
  readonly receiverId: string;
  readonly content: string;
  readonly appointmentId: string | null;
}

export interface IMessagesRepository {
  insert(data: InsertMessageData): Promise<MessageRow>;
  findThread(
    userId: string,
    otherUserId: string,
    query: PaginationQuery,
  ): Promise<{ items: MessageRow[]; total: number }>;
  findConversations(userId: string): Promise<ConversationRow[]>;
  markThreadAsRead(userId: string, otherUserId: string): Promise<void>;
}

// ── Service input ─────────────────────────────────────────────────────────────

export interface SendMessageInput {
  readonly receiverId: string;
  readonly content: string;
  readonly appointmentId?: string;
}

// ── Service contract ──────────────────────────────────────────────────────────

export interface IMessagesService {
  sendMessage(senderUserId: string, input: SendMessageInput): Promise<MessageResponse>;
  getThread(
    userId: string,
    otherUserId: string,
    query: PaginationQuery,
  ): Promise<PaginatedMessagesResponse>;
  getConversations(userId: string): Promise<ConversationSummary[]>;
  markThreadAsRead(userId: string, otherUserId: string): Promise<void>;
}
