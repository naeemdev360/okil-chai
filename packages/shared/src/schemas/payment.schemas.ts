import { z } from 'zod';
import { PaymentStatus } from '../enums/payment-status.enum.js';
import { AppointmentResponseSchema } from './appointment.schemas.js';

export const PaymentHistoryItemSchema = z.object({
  id: z.string().uuid(),
  appointmentId: z.string().uuid(),
  amount: z.string(),
  currency: z.string(),
  trxId: z.string().nullable(),
  status: z.nativeEnum(PaymentStatus),
  platformFee: z.string().nullable(),
  lawyerPayout: z.string().nullable(),
  payoutProcessedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  appointmentStartAt: z.coerce.date(),
  appointmentEndAt: z.coerce.date(),
  counterpartFirstName: z.string(),
  counterpartLastName: z.string(),
});

export type PaymentHistoryItem = z.infer<typeof PaymentHistoryItemSchema>;

export const PaginatedPaymentHistorySchema = z.object({
  data: z.array(PaymentHistoryItemSchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type PaginatedPaymentHistoryResponse = z.infer<typeof PaginatedPaymentHistorySchema>;

export const EarningsSummarySchema = z.object({
  totalEarned: z.string(),
  pendingPayout: z.string(),
  paidOut: z.string(),
  totalTransactions: z.number().int(),
});

export type EarningsSummaryResponse = z.infer<typeof EarningsSummarySchema>;

export const LawyerDashboardSchema = z.object({
  earnings: EarningsSummarySchema,
  upcomingAppointments: z.array(AppointmentResponseSchema),
  recentActivity: z.object({
    completedThisMonth: z.number().int(),
    cancelledThisMonth: z.number().int(),
    newReviewsThisMonth: z.number().int(),
  }),
});

export type LawyerDashboardResponse = z.infer<typeof LawyerDashboardSchema>;

export const PendingPayoutItemSchema = z.object({
  lawyerProfileId: z.string().uuid(),
  lawyerFirstName: z.string(),
  lawyerLastName: z.string(),
  lawyerEmail: z.string().email(),
  totalPending: z.string(),
  transactionCount: z.number().int(),
  oldestUnpaidAt: z.coerce.date(),
  paymentIds: z.array(z.string().uuid()),
});

export type PendingPayoutItem = z.infer<typeof PendingPayoutItemSchema>;
