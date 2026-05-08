import { pgEnum } from 'drizzle-orm/pg-core';
import { AppointmentStatus, AuthProvider, ConsultationType, Role } from '@okil-chai/shared';

const roleValues = [Role.CLIENT, Role.LAWYER, Role.ADMIN] as const;
const authProviderValues = [AuthProvider.LOCAL, AuthProvider.GOOGLE, AuthProvider.FACEBOOK] as const;
const appointmentStatusValues = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.NO_SHOW,
] as const;
const consultationTypeValues = [
  ConsultationType.VIDEO,
  ConsultationType.PHONE,
  ConsultationType.IN_PERSON,
] as const;

export const roleEnum = pgEnum('role', roleValues);
export const authProviderEnum = pgEnum('auth_provider', authProviderValues);
export const appointmentStatusEnum = pgEnum('appointment_status', appointmentStatusValues);
export const consultationTypeEnum = pgEnum('consultation_type', consultationTypeValues);
