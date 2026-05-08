import { useQuery } from '@tanstack/react-query';
import { lawyersKeys } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';
export function useLawyerAvailability(id, params) {
    const api = useApiClient();
    return useQuery({
        queryKey: lawyersKeys.availability(id, params),
        queryFn: () => api.lawyers.getAvailability(id, params),
        enabled: id.length > 0,
    });
}
