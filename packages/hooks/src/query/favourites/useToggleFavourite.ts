import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favouritesKeys } from '@repo/api-client';
import type { FavouriteToggleResponse } from '@repo/shared';
import { useApiClient } from '../api-client-context';

export function useToggleFavourite() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lawyerId: string) => api.favourites.toggle(lawyerId),

    onMutate: async (lawyerId) => {
      await queryClient.cancelQueries({ queryKey: favouritesKeys.lawyerStatus(lawyerId) });
      const prev = queryClient.getQueryData<FavouriteToggleResponse>(
        favouritesKeys.lawyerStatus(lawyerId),
      );
      queryClient.setQueryData<FavouriteToggleResponse>(
        favouritesKeys.lawyerStatus(lawyerId),
        (old) => (old ? { ...old, isFavourited: !old.isFavourited } : undefined),
      );
      return { prev, lawyerId };
    },

    onError: (_err, lawyerId, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(favouritesKeys.lawyerStatus(lawyerId), ctx.prev);
      }
    },

    onSettled: (_data, _err, lawyerId) => {
      queryClient.invalidateQueries({ queryKey: favouritesKeys.lawyers() });
      queryClient.invalidateQueries({ queryKey: favouritesKeys.lawyerStatus(lawyerId) });
    },
  });
}
