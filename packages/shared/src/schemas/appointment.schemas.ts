import { z } from 'zod';
import { AppointmentStatus } from '../enums/appointment-status.enum.js';
import { CaseCategory } from '../enums/case-category.enum.js';
import { ConsultationType } from '../enums/consultation-type.enum.js';

export const CreateAppointmentRequestSchema = z.object({
  lawyerId: z.string().uuid(),
  consultationType: z.nativeEnum(ConsultationType),
  caseCategory: z.nativeEnum(CaseCategory),
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
  clientNotes: z.string().max(1000).optional(),
});

export type CreateAppointmentRequest = z.infer<typeof CreateAppointmentRequestSchema>;

const AppointmentParticipantSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string().url().nullable(),
});

export type AppointmentParticipant = z.infer<typeof AppointmentParticipantSchema>;

export const AppointmentResponseSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  lawyerId: z.string().uuid(),
  consultationType: z.nativeEnum(ConsultationType),
  caseCategory: z.nativeEnum(CaseCategory),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  status: z.nativeEnum(AppointmentStatus),
  clientNotes: z.string().nullable(),
  client: AppointmentParticipantSchema,
  lawyer: AppointmentParticipantSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type AppointmentResponse = z.infer<typeof AppointmentResponseSchema>;

export const AppointmentWithPaymentSchema = AppointmentResponseSchema.extend({
  redirectUrl: z.string().nullable(),
  externalPaymentId: z.string().nullable(),
  feeAmount: z.string(),
  currency: z.string(),
});

export type AppointmentWithPayment = z.infer<typeof AppointmentWithPaymentSchema>;

export const PaginatedAppointmentsSchema = z.object({
  data: z.array(AppointmentResponseSchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type PaginatedAppointmentsResponse = z.infer<typeof PaginatedAppointmentsSchema>;
