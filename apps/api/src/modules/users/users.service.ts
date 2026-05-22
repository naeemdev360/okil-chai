import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedLawyersResponse, UpdateUserProfileRequest, UserProfileResponse } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';
import { buildPagination, buildPaginationMeta } from '../../common/utils/pagination.util';
import type { IUsersRepository, IUsersService } from './interfaces/users.interfaces';
import { USERS_REPOSITORY } from './interfaces/users.interfaces';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: IUsersRepository,
  ) {}

  async getMyProfile(userId: string): Promise<UserProfileResponse> {
    const profile = await this.usersRepository.findProfileById(userId);
    if (!profile) throw new NotFoundException('User not found');
    return profile;
  }

  async updateMyProfile(userId: string, data: UpdateUserProfileRequest): Promise<UserProfileResponse> {
    const profile = await this.usersRepository.findProfileById(userId);
    if (!profile) throw new NotFoundException('User not found');
    await this.usersRepository.updateProfile(userId, data);
    return this.usersRepository.findProfileById(userId) as Promise<UserProfileResponse>;
  }

  async addFavourite(userId: string, lawyerId: string): Promise<void> {
    return this.usersRepository.addFavourite(userId, lawyerId);
  }

  async removeFavourite(userId: string, lawyerId: string): Promise<void> {
    return this.usersRepository.removeFavourite(userId, lawyerId);
  }

  async getFavourites(userId: string, query: PaginationQuery): Promise<PaginatedLawyersResponse> {
    const { page, limit } = buildPagination(query);
    const { items, total } = await this.usersRepository.findFavourites(userId, query);
    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }
}
