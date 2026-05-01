import type { AppointmentStatus, ConsultationType } from '@okil-chai/shared';

export interface CreateAppointmentDto {
  readonly lawyerId: string;
  readonly startTime: string;
  readonly type: ConsultationType;
  readonly notes?: string;
}

export interface Appointment {
  readonly id: string;
  readonly clientId: string;
  readonly lawyerId: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly type: ConsultationType;
  readonly status: AppointmentStatus;
  readonly notes: string | null;
  readonly paymentIntentId: string | null;
  readonly totalAmount: number;
  readonly createdAt: string;
}
