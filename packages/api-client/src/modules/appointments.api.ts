import type { Http } from '../core/http';
import type { Appointment, AppointmentWithPayment, CreateAppointmentDto } from '../types/appointments.types';

export function createAppointmentsApi(http: Http) {
  return {
    create: (dto: CreateAppointmentDto) =>
      http.post<AppointmentWithPayment>('/appointments', dto),

    getById: (id: string) =>
      http.get<Appointment>(`/appointments/${id}`),

    cancel: (id: string) =>
      http.patch<void>(`/appointments/${id}/cancel`),

    complete: (id: string) =>
      http.patch<void>(`/appointments/${id}/complete`),
  } as const;
}
