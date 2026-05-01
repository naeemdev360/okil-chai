import type { Http } from '../core/http';
import type { Appointment, CreateAppointmentDto } from '../types/appointments.types';

export function createAppointmentsApi(http: Http) {
  return {
    create: (dto: CreateAppointmentDto) =>
      http.post<Appointment>('/appointments', dto),

    getById: (id: string) =>
      http.get<Appointment>(`/appointments/${id}`),

    cancel: (id: string) =>
      http.patch<Appointment>(`/appointments/${id}/cancel`),
  } as const;
}
