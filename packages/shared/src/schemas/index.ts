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

export { CompleteOnboardingSchema, LawyerProfileSchema } from './lawyer.schemas.js';
export type { CompleteOnboardingRequest, LawyerProfileResponse } from './lawyer.schemas.js';
