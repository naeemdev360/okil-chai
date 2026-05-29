import { useMutation, useQueryClient } from '@tanstack/react-query';
import { casesKeys } from '@repo/api-client';
import type { UpdateCaseDto } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useUpdateCase(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateCaseDto) => api.cases.update(caseId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casesKeys.detail(caseId) });
      queryClient.invalidateQueries({ queryKey: casesKeys.lists() });
    },
  });
}
