import { z } from 'zod';

export const SendMessageRequestSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  appointmentId: z.string().uuid().optional(),
});

export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

export const MessageResponseSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  content: z.string(),
  isRead: z.boolean(),
  readAt: z.coerce.date().nullable(),
  appointmentId: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

const ConversationParticipantSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable(),
});

export const ConversationSummarySchema = z.object({
  otherUser: ConversationParticipantSchema,
  lastMessage: MessageResponseSchema,
  unreadCount: z.number().int(),
});

export type ConversationSummary = z.infer<typeof ConversationSummarySchema>;

export const PaginatedMessagesSchema = z.object({
  data: z.array(MessageResponseSchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type PaginatedMessagesResponse = z.infer<typeof PaginatedMessagesSchema>;
