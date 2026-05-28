import type { FavouriteToggleResponse, LawyerPublicProfileResponse } from '@repo/shared';
import type { Http } from '../core/http';

export interface ListFavouritesParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
}

export function createFavouritesApi(http: Http) {
  return {
    list: (params?: ListFavouritesParams) =>
      http.list<LawyerPublicProfileResponse>('/favourites/lawyers', { params }),

    toggle: (lawyerId: string) =>
      http.post<FavouriteToggleResponse>(`/favourites/lawyers/${lawyerId}`),

    getStatus: (lawyerId: string) =>
      http.get<FavouriteToggleResponse>(`/favourites/lawyers/${lawyerId}/status`),
  } as const;
}
