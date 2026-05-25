import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsKeys } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useCancelAppointment() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.appointments.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.all() });
    },
  });
}
