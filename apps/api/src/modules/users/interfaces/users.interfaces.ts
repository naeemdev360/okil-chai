import type {
  ClientLookupResponse,
  LawyerPublicProfileResponse,
  PaginatedLawyersResponse,
  UpdateUserProfileRequest,
  UserProfileResponse,
} from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
export const USERS_SERVICE = Symbol('USERS_SERVICE');

export interface IUsersRepository {
  findProfileById(userId: string): Promise<UserProfileResponse | null>;
  findClientByEmail(email: string): Promise<ClientLookupResponse | null>;
  findClientById(userId: string): Promise<ClientLookupResponse | null>;
  updateProfile(userId: string, data: UpdateUserProfileRequest): Promise<void>;
  addFavourite(userId: string, lawyerId: string): Promise<void>;
  removeFavourite(userId: string, lawyerId: string): Promise<void>;
  isFavourite(userId: string, lawyerId: string): Promise<boolean>;
  findFavourites(userId: string, query: PaginationQuery): Promise<{ items: LawyerPublicProfileResponse[]; total: number }>;
}

export interface IUsersService {
  getMyProfile(userId: string): Promise<UserProfileResponse>;
  updateMyProfile(userId: string, data: UpdateUserProfileRequest): Promise<UserProfileResponse>;
  lookupClientByEmail(email: string): Promise<ClientLookupResponse>;
  getClientById(userId: string): Promise<ClientLookupResponse>;
  addFavourite(userId: string, lawyerId: string): Promise<void>;
  removeFavourite(userId: string, lawyerId: string): Promise<void>;
  getFavourites(userId: string, query: PaginationQuery): Promise<PaginatedLawyersResponse>;
}
