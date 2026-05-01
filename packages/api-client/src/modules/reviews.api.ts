import type { Http } from '../core/http';
import type { CreateReviewDto, Review } from '../types/reviews.types';

export function createReviewsApi(http: Http) {
  return {
    create: (dto: CreateReviewDto) =>
      http.post<Review>('/reviews', dto),
  } as const;
}
