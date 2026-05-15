import { useQuery } from '@tanstack/react-query';
import { lawyersKeys } from '@repo/api-client';
import type { LawyerAvailabilityParams } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useLawyerAvailability(id: string, params: LawyerAvailabilityParams) {
  const api = useApiClient();
  return useQuery({
    queryKey: lawyersKeys.availability(id, params),
    queryFn: () => api.lawyers.getAvailability(id, params),
    enabled: id.length > 0,
  });
}
