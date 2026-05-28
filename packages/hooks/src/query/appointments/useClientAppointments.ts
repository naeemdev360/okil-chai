import { useQuery } from '@tanstack/react-query';
import { appointmentsKeys } from '@repo/api-client';
import type { ListAppointmentsParams } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useClientAppointments(params: ListAppointmentsParams = {}) {
  const api = useApiClient();
  return useQuery({
    queryKey: appointmentsKeys.list(params),
    queryFn: () => api.appointments.list(params),
    select: (response) => ({
      appointments: response.data,
      meta: response.meta,
    }),
  });
}
