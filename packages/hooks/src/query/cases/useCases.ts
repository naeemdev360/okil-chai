import { useQuery } from '@tanstack/react-query';
import { casesKeys } from '@repo/api-client';
import type { ListCasesParams } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useCases(params: ListCasesParams = {}) {
  const api = useApiClient();
  return useQuery({
    queryKey: casesKeys.list(params),
    queryFn: () => api.cases.list(params),
    select: (response) => ({
      cases: response.data,
      meta: response.meta,
    }),
  });
}
