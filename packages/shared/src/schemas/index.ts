export {
  SignUpSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from './auth.schemas.js';
export type {
  SignUpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './auth.schemas.js';

export {
  ClientLookupResponseSchema,
  UserProfileSchema,
  UserListItemSchema,
  UpdateUserProfileSchema,
  UpdateUserEmailSchema,
  DeactivateUserSchema,
} from './user.schemas.js';
export type {
  ClientLookupResponse,
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
  CreateCaseRequestSchema,
  UpdateCaseRequestSchema,
  AssignLawyerRequestSchema,
  ReleaseAssignmentRequestSchema,
  StageTransitionRequestSchema,
  CreateHearingRequestSchema,
  UpdateHearingRequestSchema,
  LinkAppointmentRequestSchema,
  CaseStageEventResponseSchema,
  CaseHearingResponseSchema,
  CaseDocumentResponseSchema,
  CaseLinkedAppointmentSchema,
  CaseAssignmentHistoryItemSchema,
  CaseSummarySchema,
  CaseDetailSchema,
  PaginatedCasesSchema,
} from './case.schemas.js';
export type {
  CreateCaseRequest,
  UpdateCaseRequest,
  AssignLawyerRequest,
  ReleaseAssignmentRequest,
  StageTransitionRequest,
  CreateHearingRequest,
  UpdateHearingRequest,
  LinkAppointmentRequest,
  CaseStageEventResponse,
  CaseHearingResponse,
  CaseDocumentResponse,
  CaseLinkedAppointment,
  CaseAssignmentHistoryItem,
  CaseSummary,
  CaseDetail,
  PaginatedCasesResponse,
} from './case.schemas.js';

export {
  UrgencySchema,
  BudgetSchema,
  AiMatchRequestSchema,
  AiMatchedLawyerSchema,
  AiMatchResponseSchema,
} from './ai-match.schemas.js';
export type {
  AiMatchRequest,
  AiMatchedLawyerResponse,
  AiMatchResponse,
} from './ai-match.schemas.js';

export {
  CompleteOnboardingSchema,
  LawyerDocumentSchema,
  LawyerProfileSchema,
  LawyerPublicProfileSchema,
  PaginatedLawyersSchema,
  AvailabilitySlotSchema,
  AvailabilityRuleResponseSchema,
} from './lawyer.schemas.js';
export type {
  CompleteOnboardingRequest,
  LawyerDocumentResponse,
  LawyerProfileResponse,
  LawyerPublicProfileResponse,
  PaginatedLawyersResponse,
  AvailabilitySlot,
  AvailabilityRuleResponse,
} from './lawyer.schemas.js';
