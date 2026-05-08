import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsKeys, lawyersKeys } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';
export function useCreateAppointment() {
    const api = useApiClient();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto) => api.appointments.create(dto),
        onSuccess: (appointment) => {
            queryClient.invalidateQueries({ queryKey: appointmentsKeys.all() });
            // Invalidate the lawyer's availability — a slot was just booked.
            queryClient.invalidateQueries({ queryKey: lawyersKeys.details() });
        },
    });
}
