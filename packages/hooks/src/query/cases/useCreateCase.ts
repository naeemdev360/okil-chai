import { useMutation, useQueryClient } from '@tanstack/react-query';
import { casesKeys } from '@repo/api-client';
import type { CreateCaseDto } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useCreateCase() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCaseDto) => api.cases.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casesKeys.all() });
    },
  });
}
