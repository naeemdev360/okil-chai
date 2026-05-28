import { useQuery } from '@tanstack/react-query';
import { favouritesKeys } from '@repo/api-client';
import type { ListFavouritesParams } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useFavouriteLawyers(params?: ListFavouritesParams) {
  const api = useApiClient();
  return useQuery({
    queryKey: favouritesKeys.lawyersList(params),
    queryFn: () => api.favourites.list(params),
    select: (response) => ({
      lawyers: response.data,
      meta: response.meta,
    }),
  });
}
