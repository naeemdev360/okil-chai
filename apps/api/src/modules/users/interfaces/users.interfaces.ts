import type { UpdateUserProfileRequest, UserProfileResponse } from '@repo/shared';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
export const USERS_SERVICE = Symbol('USERS_SERVICE');

export interface IUsersRepository {
  findProfileById(userId: string): Promise<UserProfileResponse | null>;
  updateProfile(userId: string, data: UpdateUserProfileRequest): Promise<void>;
}

export interface IUsersService {
  getMyProfile(userId: string): Promise<UserProfileResponse>;
  updateMyProfile(userId: string, data: UpdateUserProfileRequest): Promise<UserProfileResponse>;
}
