import { z } from 'zod';

export const CreateReviewRequestSchema = z.object({
  appointmentId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(2000).optional(),
});

export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

const ReviewAuthorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable(),
});

export const ReviewResponseSchema = z.object({
  id: z.string().uuid(),
  appointmentId: z.string().uuid(),
  lawyerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().nullable(),
  client: ReviewAuthorSchema,
  createdAt: z.coerce.date(),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

export const PaginatedReviewsSchema = z.object({
  data: z.array(ReviewResponseSchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type PaginatedReviewsResponse = z.infer<typeof PaginatedReviewsSchema>;
