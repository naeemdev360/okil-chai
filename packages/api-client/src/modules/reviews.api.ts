import type { ReviewResponse } from '@repo/shared';
import type { Http } from '../core/http';
import type { CreateReviewDto } from '../types/reviews.types';

export function createReviewsApi(http: Http) {
  return {
    create: (dto: CreateReviewDto) =>
      http.post<ReviewResponse>('/reviews', dto),

    getByLawyer: (lawyerId: string, params?: { page?: number; limit?: number }) =>
      http.list<ReviewResponse>(`/reviews/lawyer/${lawyerId}`, { params }),
  } as const;
}
