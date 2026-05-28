import type { ListAppointmentsParams } from '../types/appointments.types';

export const appointmentsKeys = {
  all: () => ['appointments'] as const,

  lists: () => [...appointmentsKeys.all(), 'list'] as const,
  list: (params: ListAppointmentsParams) => [...appointmentsKeys.lists(), params] as const,

  details: () => [...appointmentsKeys.all(), 'detail'] as const,
  detail: (id: string) => [...appointmentsKeys.details(), id] as const,
} as const;
