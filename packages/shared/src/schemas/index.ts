export {
  UserProfileSchema,
  UserListItemSchema,
  UpdateUserProfileSchema,
  UpdateUserEmailSchema,
  DeactivateUserSchema,
} from './user.schemas.js';
export type {
  UserProfileResponse,
  UserListItemResponse,
  UpdateUserProfileRequest,
  UpdateUserEmailRequest,
  DeactivateUserRequest,
} from './user.schemas.js';

export {
  CompleteOnboardingSchema,
  LawyerProfileSchema,
  LawyerPublicProfileSchema,
  PaginatedLawyersSchema,
  AvailabilitySlotSchema,
} from './lawyer.schemas.js';
export type {
  CompleteOnboardingRequest,
  LawyerProfileResponse,
  LawyerPublicProfileResponse,
  PaginatedLawyersResponse,
  AvailabilitySlot,
} from './lawyer.schemas.js';
