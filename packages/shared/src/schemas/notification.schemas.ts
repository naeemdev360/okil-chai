import { z } from 'zod';
import { NotificationType } from '../enums/notification-type.enum.js';

export const NotificationResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  body: z.string(),
  payload: z.record(z.unknown()).nullable(),
  isRead: z.boolean(),
  createdAt: z.coerce.date(),
});

export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;

export const PaginatedNotificationsSchema = z.object({
  data: z.array(NotificationResponseSchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
  unreadCount: z.number().int(),
});

export type PaginatedNotificationsResponse = z.infer<typeof PaginatedNotificationsSchema>;
