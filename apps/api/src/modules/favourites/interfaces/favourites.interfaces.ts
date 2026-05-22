import type { FavouriteToggleResponse, PaginatedLawyersResponse } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';

export const FAVOURITES_SERVICE = Symbol('FAVOURITES_SERVICE');
export const FAVOURITES_REPOSITORY = Symbol('FAVOURITES_REPOSITORY');

// ── Repository types ──────────────────────────────────────────────────────────

export interface FavouriteExistsResult {
  readonly exists: boolean;
  readonly id: string | null;
}

export interface IFavouritesRepository {
  findByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<FavouriteExistsResult>;
  insert(userId: string, lawyerId: string): Promise<void>;
  deleteById(id: string): Promise<void>;
  findFavouritesByUserId(
    userId: string,
    query: PaginationQuery,
  ): Promise<{ lawyers: import('@repo/shared').LawyerPublicProfileResponse[]; total: number }>;
}

// ── Service contract ──────────────────────────────────────────────────────────

export interface IFavouritesService {
  toggleFavourite(userId: string, lawyerId: string): Promise<FavouriteToggleResponse>;
  listFavourites(userId: string, query: PaginationQuery): Promise<PaginatedLawyersResponse>;
  isFavourited(userId: string, lawyerId: string): Promise<FavouriteToggleResponse>;
}
