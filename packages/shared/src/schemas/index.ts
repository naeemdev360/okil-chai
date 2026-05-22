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
  NotificationResponseSchema,
  PaginatedNotificationsSchema,
} from './notification.schemas.js';
export type {
  NotificationResponse,
  PaginatedNotificationsResponse,
} from './notification.schemas.js';

export {
  SendMessageRequestSchema,
  MessageResponseSchema,
  ConversationSummarySchema,
  PaginatedMessagesSchema,
} from './message.schemas.js';
export type {
  SendMessageRequest,
  MessageResponse,
  ConversationSummary,
  PaginatedMessagesResponse,
} from './message.schemas.js';

export {
  FavouriteToggleResponseSchema,
} from './favourite.schemas.js';
export type {
  FavouriteToggleResponse,
} from './favourite.schemas.js';

export {
  CreateReviewRequestSchema,
  RespondToReviewRequestSchema,
  ReviewResponseSchema,
  PaginatedReviewsSchema,
} from './review.schemas.js';
export type {
  CreateReviewRequest,
  RespondToReviewRequest,
  ReviewResponse,
  PaginatedReviewsResponse,
} from './review.schemas.js';

export {
  PaymentHistoryItemSchema,
  PaginatedPaymentHistorySchema,
  EarningsSummarySchema,
  LawyerDashboardSchema,
  PendingPayoutItemSchema,
} from './payment.schemas.js';
export type {
  PaymentHistoryItem,
  PaginatedPaymentHistoryResponse,
  EarningsSummaryResponse,
  LawyerDashboardResponse,
  PendingPayoutItem,
} from './payment.schemas.js';

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
