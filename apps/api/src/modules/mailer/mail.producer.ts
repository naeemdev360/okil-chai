import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MAIL_JOB, MAIL_QUEUE } from './mail.constants';
import type {
  BookingConfirmationEmailJob,
  IMailProducer,
  PasswordResetEmailJob,
  VerificationEmailJob,
} from './interfaces/mailer.interfaces';

@Injectable()
export class MailProducer implements IMailProducer {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly queue: Queue) {}

  async sendVerificationEmail(data: VerificationEmailJob): Promise<void> {
    await this.queue.add(MAIL_JOB.VERIFICATION_EMAIL, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: 50,
    });
  }

  async sendResendVerificationEmail(data: VerificationEmailJob): Promise<void> {
    await this.queue.add(MAIL_JOB.RESEND_VERIFICATION_EMAIL, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: 50,
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmailJob): Promise<void> {
    await this.queue.add(MAIL_JOB.PASSWORD_RESET_EMAIL, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: 50,
    });
  }

  async sendBookingConfirmationEmail(data: BookingConfirmationEmailJob): Promise<void> {
    await this.queue.add(MAIL_JOB.BOOKING_CONFIRMATION_EMAIL, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: true,
      removeOnFail: 50,
    });
  }
}
