import { useQuery } from '@tanstack/react-query';
import { lawyersKeys } from '@okil-chai/api-client';
import type { LawyerAvailabilityParams } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';

export function useLawyerAvailability(id: string, params: LawyerAvailabilityParams) {
  const api = useApiClient();
  return useQuery({
    queryKey: lawyersKeys.availability(id, params),
    queryFn: () => api.lawyers.getAvailability(id, params),
    enabled: id.length > 0,
  });
}
