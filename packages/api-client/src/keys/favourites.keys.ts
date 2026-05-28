import type { ListFavouritesParams } from '../modules/favourites.api';

export const favouritesKeys = {
  all: () => ['favourites'] as const,
  lawyers: () => [...favouritesKeys.all(), 'lawyers'] as const,
  lawyersList: (params?: ListFavouritesParams) => [...favouritesKeys.lawyers(), 'list', params] as const,
  lawyerStatus: (lawyerId: string) => [...favouritesKeys.lawyers(), lawyerId, 'status'] as const,
} as const;
