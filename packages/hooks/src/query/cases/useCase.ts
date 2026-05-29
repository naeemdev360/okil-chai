import { useQuery } from '@tanstack/react-query';
import { casesKeys } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useCase(id: string | undefined) {
  const api = useApiClient();
  return useQuery({
    queryKey: id ? casesKeys.detail(id) : ['cases', 'detail', 'disabled'],
    queryFn: () => api.cases.getById(id!),
    enabled: !!id,
  });
}
