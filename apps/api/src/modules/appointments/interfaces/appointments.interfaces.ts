import type {
  AppointmentResponse,
  AppointmentWithPayment,
  PaginatedAppointmentsResponse,
} from '@repo/shared';
import { AppointmentStatus, ConsultationType, Role } from '@repo/shared';

export const APPOINTMENTS_REPOSITORY = Symbol('APPOINTMENTS_REPOSITORY');
export const APPOINTMENTS_SERVICE = Symbol('APPOINTMENTS_SERVICE');

// ── Row returned by all joined queries ───────────────────────────────────────

export interface AppointmentRow {
  readonly id: string;
  readonly clientId: string;
  readonly lawyerId: string;
  readonly consultationType: ConsultationType;
  readonly startAt: Date;
  readonly endAt: Date;
  readonly status: AppointmentStatus;
  readonly clientNotes: string | null;
  readonly externalPaymentId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  // joined from users (client)
  readonly clientFirstName: string;
  readonly clientLastName: string;
  readonly clientAvatarUrl: string | null;
  // joined from lawyer_profiles
  readonly lawyerUserId: string;
  readonly lawyerFirstName: string;
  readonly lawyerLastName: string;
  readonly lawyerPhotoUrl: string | null;
}

export interface AppointmentContactInfo {
  readonly clientEmail: string;
  readonly clientFirstName: string;
  readonly lawyerEmail: string;
  readonly lawyerFirstName: string;
  readonly startAt: Date;
  readonly endAt: Date;
  readonly consultationType: ConsultationType;
}

// ── Service inputs ────────────────────────────────────────────────────────────

export interface CreateAppointmentInput {
  readonly lawyerId: string;
  readonly consultationType: ConsultationType;
  readonly startAt: Date;
  readonly endAt: Date;
  readonly clientNotes?: string;
}

export interface ListAppointmentsQuery {
  readonly status?: AppointmentStatus;
  readonly page?: number;
  readonly limit?: number;
}

// ── Repository inputs ─────────────────────────────────────────────────────────

export interface InsertAppointmentData {
  readonly clientId: string;
  readonly lawyerId: string;
  readonly consultationType: ConsultationType;
  readonly startAt: Date;
  readonly endAt: Date;
  readonly clientNotes: string | null;
  readonly externalPaymentId: string | null;
  readonly status: AppointmentStatus;
}

// ── Repository contract ───────────────────────────────────────────────────────

export interface IAppointmentsRepository {
  insert(data: InsertAppointmentData): Promise<AppointmentRow>;
  findById(id: string): Promise<AppointmentRow | null>;
  findByParticipant(
    userId: string,
    isLawyer: boolean,
    query: ListAppointmentsQuery,
  ): Promise<{ items: AppointmentRow[]; total: number }>;
  updateStatus(id: string, status: AppointmentStatus): Promise<void>;
  updateExternalPaymentId(id: string, externalPaymentId: string): Promise<void>;
  findByExternalPaymentId(externalPaymentId: string): Promise<AppointmentRow | null>;
  hasConflict(lawyerId: string, startAt: Date, endAt: Date): Promise<boolean>;
  findContactInfo(appointmentId: string): Promise<AppointmentContactInfo | null>;
}

// ── Service contract ──────────────────────────────────────────────────────────

export interface IAppointmentsService {
  createAppointment(
    clientUserId: string,
    input: CreateAppointmentInput,
  ): Promise<AppointmentWithPayment>;
  listAppointments(
    userId: string,
    roles: readonly Role[],
    query: ListAppointmentsQuery,
  ): Promise<PaginatedAppointmentsResponse>;
  getAppointment(
    userId: string,
    roles: readonly Role[],
    appointmentId: string,
  ): Promise<AppointmentResponse>;
  cancelAppointment(
    userId: string,
    roles: readonly Role[],
    appointmentId: string,
  ): Promise<void>;
  completeAppointment(lawyerUserId: string, appointmentId: string): Promise<void>;
  confirmPayment(externalPaymentId: string): Promise<string>;
  handlePaymentFailure(externalPaymentId: string): Promise<void>;
}
