import { pgEnum } from 'drizzle-orm/pg-core';
import {
  AppointmentStatus,
  AuthProvider,
  AuthTokenType,
  CaseAssignmentStatus,
  CaseCategory,
  CaseHearingType,
  CaseStage,
  CaseStatus,
  ConsultationType,
  DocumentStatus,
  DocumentType,
  NotificationType,
  PaymentStatus,
  Role,
  StripeAccountStatus,
  SubscriptionTier,
  VerificationStatus,
} from '@repo/shared';

const userRoleValues = [
  Role.CLIENT,
  Role.LAWYER,
  Role.PLATFORM_ADMIN,
  Role.SUPPORT_AGENT,
  Role.FIRM_ADMIN,
  Role.FIRM_MANAGER,
] as const;
const authProviderValues = [AuthProvider.LOCAL, AuthProvider.GOOGLE, AuthProvider.FACEBOOK] as const;
const appointmentStatusValues = [
  AppointmentStatus.DRAFT,
  AppointmentStatus.PENDING_PAYMENT,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.RESCHEDULE_REQUESTED,
  AppointmentStatus.RESCHEDULED,
  AppointmentStatus.IN_PROGRESS,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.CANCELLED_BY_CLIENT,
  AppointmentStatus.CANCELLED_BY_LAWYER,
  AppointmentStatus.CANCELLED_BY_ADMIN,
  AppointmentStatus.NO_SHOW_CLIENT,
  AppointmentStatus.NO_SHOW_LAWYER,
  AppointmentStatus.REFUNDED,
  AppointmentStatus.DISPUTED,
] as const;
const consultationTypeValues = [
  ConsultationType.VIDEO,
  ConsultationType.PHONE,
  ConsultationType.IN_PERSON,
] as const;
const caseCategoryValues = [
  CaseCategory.CRIMINAL,
  CaseCategory.FAMILY,
  CaseCategory.LAND_PROPERTY,
  CaseCategory.COMMERCIAL,
  CaseCategory.CIVIL,
  CaseCategory.LABOR,
  CaseCategory.CONSTITUTIONAL,
  CaseCategory.INTELLECTUAL_PROPERTY,
  CaseCategory.IMMIGRATION,
  CaseCategory.TAX,
  CaseCategory.CONSUMER_RIGHTS,
  CaseCategory.OTHER,
] as const;
const verificationStatusValues = [
  VerificationStatus.DRAFT,
  VerificationStatus.PENDING,
  VerificationStatus.UNDER_REVIEW,
  VerificationStatus.APPROVED,
  VerificationStatus.REJECTED,
  VerificationStatus.REQUIRES_RESUBMISSION,
] as const;
const authTokenTypeValues = [
  AuthTokenType.EMAIL_VERIFICATION,
  AuthTokenType.PASSWORD_RESET,
] as const;
const documentTypeValues = [
  DocumentType.BAR_CERTIFICATE,
  DocumentType.LAW_DEGREE,
  DocumentType.GOVERNMENT_ID,
  DocumentType.CERTIFICATION,
  DocumentType.OTHER,
] as const;
const subscriptionTierValues = [SubscriptionTier.FREE, SubscriptionTier.PRO] as const;
const stripeAccountStatusValues = [
  StripeAccountStatus.NOT_CONNECTED,
  StripeAccountStatus.PENDING,
  StripeAccountStatus.ACTIVE,
  StripeAccountStatus.RESTRICTED,
] as const;
const paymentStatusValues = [
  PaymentStatus.PENDING,
  PaymentStatus.COMPLETED,
  PaymentStatus.REFUNDED,
  PaymentStatus.FAILED,
] as const;
const documentStatusValues = [
  DocumentStatus.PENDING,
  DocumentStatus.APPROVED,
  DocumentStatus.REJECTED,
] as const;
const notificationTypeValues = [
  NotificationType.BOOKING_CONFIRMED,
  NotificationType.BOOKING_CANCELLED,
  NotificationType.APPOINTMENT_REMINDER,
  NotificationType.APPOINTMENT_COMPLETED,
  NotificationType.REVIEW_RECEIVED,
  NotificationType.LAWYER_APPROVED,
  NotificationType.LAWYER_REJECTED,
  NotificationType.PAYMENT_FAILED,
  NotificationType.CASE_ASSIGNMENT_REQUESTED,
  NotificationType.CASE_ASSIGNMENT_ACCEPTED,
  NotificationType.CASE_ASSIGNMENT_DECLINED,
  NotificationType.CASE_ASSIGNMENT_RELEASED,
  NotificationType.CASE_STAGE_CHANGED,
  NotificationType.CASE_HEARING_SCHEDULED,
  NotificationType.CASE_HEARING_UPDATED,
  NotificationType.CASE_DOCUMENT_UPLOADED,
  NotificationType.CASE_CLOSED,
] as const;
const caseStageValues = [
  CaseStage.INTAKE,
  CaseStage.LAWYER_ASSIGNED,
  CaseStage.DISCOVERY,
  CaseStage.PRE_FILING,
  CaseStage.FILED,
  CaseStage.HEARING_SCHEDULED,
  CaseStage.IN_TRIAL,
  CaseStage.JUDGMENT,
  CaseStage.APPEAL,
  CaseStage.SETTLEMENT,
  CaseStage.ON_HOLD,
  CaseStage.CLOSED,
] as const;
const caseStatusValues = [CaseStatus.ACTIVE, CaseStatus.ON_HOLD, CaseStatus.CLOSED] as const;
const caseAssignmentStatusValues = [
  CaseAssignmentStatus.UNASSIGNED,
  CaseAssignmentStatus.PENDING,
  CaseAssignmentStatus.ACCEPTED,
  CaseAssignmentStatus.DECLINED,
  CaseAssignmentStatus.RELEASED,
] as const;
const caseHearingTypeValues = [
  CaseHearingType.MENTION,
  CaseHearingType.EVIDENCE,
  CaseHearingType.JUDGMENT,
  CaseHearingType.APPEAL,
  CaseHearingType.OTHER,
] as const;

export const userRoleEnum = pgEnum('user_role', userRoleValues);
export const authProviderEnum = pgEnum('auth_provider', authProviderValues);
export const authTokenTypeEnum = pgEnum('auth_token_type', authTokenTypeValues);
export const appointmentStatusEnum = pgEnum('appointment_status', appointmentStatusValues);
export const consultationTypeEnum = pgEnum('consultation_type', consultationTypeValues);
export const caseCategoryEnum = pgEnum('case_category', caseCategoryValues);
export const verificationStatusEnum = pgEnum('verification_status', verificationStatusValues);
export const documentTypeEnum = pgEnum('document_type', documentTypeValues);
export const documentStatusEnum = pgEnum('document_status', documentStatusValues);
export const subscriptionTierEnum = pgEnum('subscription_tier', subscriptionTierValues);
export const stripeAccountStatusEnum = pgEnum('stripe_account_status', stripeAccountStatusValues);
export const paymentStatusEnum = pgEnum('payment_status', paymentStatusValues);
export const notificationTypeEnum = pgEnum('notification_type', notificationTypeValues);
export const caseStageEnum = pgEnum('case_stage', caseStageValues);
export const caseStatusEnum = pgEnum('case_status', caseStatusValues);
export const caseAssignmentStatusEnum = pgEnum('case_assignment_status', caseAssignmentStatusValues);
export const caseHearingTypeEnum = pgEnum('case_hearing_type', caseHearingTypeValues);
