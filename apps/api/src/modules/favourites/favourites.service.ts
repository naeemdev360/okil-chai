import { Inject, Injectable } from '@nestjs/common';
import type { FavouriteToggleResponse, PaginatedLawyersResponse, SearchPaginationQuery } from '@repo/shared';
import { buildPagination, buildPaginationMeta } from '../../common/utils/pagination.util';
import {
  FAVOURITES_REPOSITORY,
  type IFavouritesRepository,
  type IFavouritesService,
} from './interfaces/favourites.interfaces';

@Injectable()
export class FavouritesService implements IFavouritesService {
  constructor(
    @Inject(FAVOURITES_REPOSITORY)
    private readonly favouritesRepository: IFavouritesRepository,
  ) {}

  async toggleFavourite(userId: string, lawyerId: string): Promise<FavouriteToggleResponse> {
    const existing = await this.favouritesRepository.findByUserIdAndLawyerId(userId, lawyerId);

    if (existing.exists && existing.id) {
      await this.favouritesRepository.deleteById(existing.id);
      return { lawyerId, isFavourited: false };
    }

    await this.favouritesRepository.insert(userId, lawyerId);
    return { lawyerId, isFavourited: true };
  }

  async listFavourites(userId: string, query: SearchPaginationQuery): Promise<PaginatedLawyersResponse> {
    const { page, limit } = buildPagination(query);
    const { lawyers, total } = await this.favouritesRepository.findFavouritesByUserId(
      userId,
      query,
    );

    return {
      data: lawyers,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async isFavourited(userId: string, lawyerId: string): Promise<FavouriteToggleResponse> {
    const existing = await this.favouritesRepository.findByUserIdAndLawyerId(userId, lawyerId);
    return { lawyerId, isFavourited: existing.exists };
  }
}
