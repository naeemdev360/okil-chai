import { useQuery } from '@tanstack/react-query';
import { lawyersKeys } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';

export function useLawyerDetail(id: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: lawyersKeys.detail(id),
    queryFn: () => api.lawyers.getById(id),
    enabled: id.length > 0,
  });
}
