import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type {
  ConversationSummary,
  MessageResponse,
  PaginatedMessagesResponse,
} from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';
import { buildPagination, buildPaginationMeta } from '../../common/utils/pagination.util';
import { MessagesGateway } from './messages.gateway';
import type {
  ConversationRow,
  IMessagesRepository,
  IMessagesService,
  MessageRow,
  SendMessageInput,
} from './interfaces/messages.interfaces';
import { MESSAGES_REPOSITORY } from './interfaces/messages.interfaces';

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    @Inject(MESSAGES_REPOSITORY)
    private readonly messagesRepository: IMessagesRepository,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  async sendMessage(senderUserId: string, input: SendMessageInput): Promise<MessageResponse> {
    if (senderUserId === input.receiverId) {
      throw new BadRequestException('You cannot send a message to yourself');
    }

    const row = await this.messagesRepository.insert({
      senderId: senderUserId,
      receiverId: input.receiverId,
      content: input.content,
      appointmentId: input.appointmentId ?? null,
    });

    const response = this.toMessageResponse(row);
    this.messagesGateway.emitNewMessage(input.receiverId, response);

    return response;
  }

  async getThread(
    userId: string,
    otherUserId: string,
    query: PaginationQuery,
  ): Promise<PaginatedMessagesResponse> {
    const { page, limit } = buildPagination(query);
    const { items, total } = await this.messagesRepository.findThread(userId, otherUserId, query);

    return {
      data: items.map((r) => this.toMessageResponse(r)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getConversations(userId: string): Promise<ConversationSummary[]> {
    const rows = await this.messagesRepository.findConversations(userId);
    return rows.map((r) => this.toConversationSummary(r));
  }

  async markThreadAsRead(userId: string, otherUserId: string): Promise<void> {
    await this.messagesRepository.markThreadAsRead(userId, otherUserId);
    this.messagesGateway.emitThreadRead(otherUserId, userId);
  }

  private toMessageResponse(row: MessageRow): MessageResponse {
    return {
      id: row.id,
      senderId: row.senderId,
      receiverId: row.receiverId,
      content: row.content,
      isRead: row.isRead,
      readAt: row.readAt,
      appointmentId: row.appointmentId,
      createdAt: row.createdAt,
    };
  }

  private toConversationSummary(row: ConversationRow): ConversationSummary {
    return {
      otherUser: {
        id: row.otherUserId,
        firstName: row.otherUserFirstName,
        lastName: row.otherUserLastName,
        avatarUrl: row.otherUserAvatarUrl,
      },
      lastMessage: {
        id: row.lastMessageId,
        senderId: row.lastMessageSenderId,
        receiverId: row.lastMessageReceiverId,
        content: row.lastMessageContent,
        isRead: row.lastMessageIsRead,
        readAt: row.lastMessageReadAt,
        appointmentId: row.lastMessageAppointmentId,
        createdAt: row.lastMessageCreatedAt,
      },
      unreadCount: row.unreadCount,
    };
  }
}
