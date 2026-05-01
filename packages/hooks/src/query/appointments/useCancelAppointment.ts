import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsKeys } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';

export function useCancelAppointment() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.appointments.cancel(id),
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        appointmentsKeys.detail(appointment.id),
        appointment,
      );
    },
  });
}
