import type { AppointmentStatus, CaseCategory, ConsultationType } from '@repo/shared';

export interface ListAppointmentsParams {
  readonly status?: AppointmentStatus;
  readonly upcoming?: boolean;
  readonly past?: boolean;
  readonly page?: number;
  readonly limit?: number;
}

export interface CreateAppointmentDto {
  readonly lawyerId: string;
  readonly consultationType: ConsultationType;
  readonly caseCategory: CaseCategory;
  readonly startAt: string;
  readonly endAt: string;
  readonly clientNotes?: string;
}

export interface AppointmentParticipant {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly photoUrl: string | null;
}

export interface Appointment {
  readonly id: string;
  readonly clientId: string;
  readonly lawyerId: string;
  readonly consultationType: ConsultationType;
  readonly caseCategory: CaseCategory;
  readonly startAt: string;
  readonly endAt: string;
  readonly status: AppointmentStatus;
  readonly feeAmount: string;
  readonly clientNotes: string | null;
  readonly client: AppointmentParticipant;
  readonly lawyer: AppointmentParticipant;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AppointmentWithPayment extends Appointment {
  readonly redirectUrl: string | null;
  readonly externalPaymentId: string | null;
  readonly feeAmount: string;
  readonly currency: string;
}
