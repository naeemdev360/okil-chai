import { useQuery } from '@tanstack/react-query';
import { messagesKeys } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useConversations() {
  const api = useApiClient();
  return useQuery({
    queryKey: messagesKeys.conversations(),
    queryFn: () => api.messages.getConversations(),
  });
}
