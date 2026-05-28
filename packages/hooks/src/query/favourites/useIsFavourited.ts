import { useQuery } from '@tanstack/react-query';
import { favouritesKeys } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useIsFavourited(lawyerId: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: favouritesKeys.lawyerStatus(lawyerId),
    queryFn: () => api.favourites.getStatus(lawyerId),
    enabled: lawyerId.length > 0,
    staleTime: 60_000,
  });
}
