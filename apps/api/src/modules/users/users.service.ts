import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateUserProfileRequest, UserProfileResponse } from '@repo/shared';
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
}
