import { useQuery } from '@tanstack/react-query';
import { appointmentsKeys } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';
export function useAppointment(id) {
    const api = useApiClient();
    return useQuery({
        queryKey: appointmentsKeys.detail(id),
        queryFn: () => api.appointments.getById(id),
        enabled: id.length > 0,
    });
}
