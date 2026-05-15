export const MAIL_QUEUE = 'mail';

export const MAIL_JOB = {
  VERIFICATION_EMAIL: 'verification-email',
  RESEND_VERIFICATION_EMAIL: 'resend-verification-email',
} as const;

export const MAIL_SUBJECT = {
  VERIFICATION_EMAIL: (appName: string) => `Verify your ${appName} account`,
  RESEND_VERIFICATION_EMAIL: (appName: string) => `Your new ${appName} verification link`,
} as const;
