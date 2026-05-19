export const MAILER_SERVICE = Symbol('MAILER_SERVICE');
export const MAIL_PRODUCER = Symbol('MAIL_PRODUCER');

export interface SendEmailOptions {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
}

export interface IMailerService {
  sendEmail(options: SendEmailOptions): Promise<void>;
  verify(): Promise<void>;
}

export interface VerificationEmailJob {
  readonly to: string;
  readonly firstName: string;
  readonly verifyUrl: string;
}

export interface PasswordResetEmailJob {
  readonly to: string;
  readonly firstName: string;
  readonly resetUrl: string;
}

export interface BookingConfirmationEmailJob {
  readonly to: string;
  readonly firstName: string;
  readonly appointmentDate: string;
  readonly consultationType: string;
  readonly isLawyer: boolean;
}

export interface IMailProducer {
  sendVerificationEmail(data: VerificationEmailJob): Promise<void>;
  sendResendVerificationEmail(data: VerificationEmailJob): Promise<void>;
  sendPasswordResetEmail(data: PasswordResetEmailJob): Promise<void>;
  sendBookingConfirmationEmail(data: BookingConfirmationEmailJob): Promise<void>;
}
