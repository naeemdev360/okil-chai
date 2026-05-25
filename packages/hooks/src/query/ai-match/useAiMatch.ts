import { useMutation } from '@tanstack/react-query';
import type { AiMatchRequest } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useAiMatch() {
  const api = useApiClient();
  return useMutation({
    mutationFn: (body: AiMatchRequest) => api.aiMatch.match(body),
  });
}
