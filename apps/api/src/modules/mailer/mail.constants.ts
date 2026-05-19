export const MAIL_QUEUE = 'mail';

export const MAIL_JOB = {
  VERIFICATION_EMAIL: 'verification-email',
  RESEND_VERIFICATION_EMAIL: 'resend-verification-email',
  PASSWORD_RESET_EMAIL: 'password-reset-email',
  BOOKING_CONFIRMATION_EMAIL: 'booking-confirmation-email',
} as const;

export const MAIL_SUBJECT = {
  VERIFICATION_EMAIL: (appName: string) => `Verify your ${appName} account`,
  RESEND_VERIFICATION_EMAIL: (appName: string) => `Your new ${appName} verification link`,
  PASSWORD_RESET_EMAIL: (appName: string) => `Reset your ${appName} password`,
  BOOKING_CONFIRMATION_EMAIL: (appName: string) => `Your ${appName} appointment is confirmed`,
} as const;

export const PASSWORD_RESET_EXPIRES_MINUTES = 60;
