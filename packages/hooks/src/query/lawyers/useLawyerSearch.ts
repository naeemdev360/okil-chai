import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { lawyersKeys } from '@repo/api-client';
import type { LawyerSearchParams } from '@repo/api-client';
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
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
