import { useQuery } from '@tanstack/react-query';
import { lawyersKeys } from '@okil-chai/api-client';
import type { LawyerSearchParams } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';

export function useLawyerSearch(params: LawyerSearchParams) {
  const api = useApiClient();
  return useQuery({
    queryKey: lawyersKeys.list(params),
    queryFn: () => api.lawyers.search(params),
    select: (response) => ({
      lawyers: response.data,
      meta: response.meta,
    }),
  });
}
