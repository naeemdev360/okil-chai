import { useQuery } from '@tanstack/react-query';
import { reviewsKeys } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useLawyerReviews(lawyerId: string, page = 1, limit = 10) {
  const api = useApiClient();
  return useQuery({
    queryKey: [...reviewsKeys.byLawyer(lawyerId), page, limit],
    queryFn: () => api.reviews.getByLawyer(lawyerId, { page, limit }),
    select: (res) => ({ reviews: res.data, meta: res.meta }),
    staleTime: 60_000,
    enabled: lawyerId.length > 0,
  });
}
