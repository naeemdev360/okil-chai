import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lawyersKeys, reviewsKeys } from '@okil-chai/api-client';
import type { CreateReviewDto } from '@okil-chai/api-client';
import { useApiClient } from '../api-client-context';

export function useCreateReview() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateReviewDto) => api.reviews.create(dto),
    onSuccess: (review) => {
      // Lawyer profile holds rating + reviewCount — bust it so it refreshes.
      queryClient.invalidateQueries({ queryKey: lawyersKeys.detail(review.lawyerId) });
      queryClient.invalidateQueries({ queryKey: reviewsKeys.byLawyer(review.lawyerId) });
    },
  });
}
