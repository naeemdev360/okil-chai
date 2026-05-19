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
  CreateAppointmentRequestSchema,
  AppointmentResponseSchema,
  AppointmentWithPaymentSchema,
  PaginatedAppointmentsSchema,
} from './appointment.schemas.js';
export type {
  CreateAppointmentRequest,
  AppointmentParticipant,
  AppointmentResponse,
  AppointmentWithPayment,
  PaginatedAppointmentsResponse,
} from './appointment.schemas.js';

export {
  CompleteOnboardingSchema,
  LawyerProfileSchema,
  LawyerPublicProfileSchema,
  PaginatedLawyersSchema,
  AvailabilitySlotSchema,
  AvailabilityRuleResponseSchema,
} from './lawyer.schemas.js';
export type {
  CompleteOnboardingRequest,
  LawyerProfileResponse,
  LawyerPublicProfileResponse,
  PaginatedLawyersResponse,
  AvailabilitySlot,
  AvailabilityRuleResponse,
} from './lawyer.schemas.js';
