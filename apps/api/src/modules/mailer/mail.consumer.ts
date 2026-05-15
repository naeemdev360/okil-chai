import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { MAIL_JOB, MAIL_QUEUE, MAIL_SUBJECT } from './mail.constants';
import {
  MAILER_SERVICE,
  type IMailerService,
  type VerificationEmailJob,
} from './interfaces/mailer.interfaces';
import { renderResendVerificationEmail } from './templates/ResendVerificationEmail';
import { renderVerificationEmail } from './templates/VerificationEmail';

@Processor(MAIL_QUEUE)
export class MailConsumer extends WorkerHost {
  private readonly logger = new Logger(MailConsumer.name);
  private readonly appName: string;

  constructor(
    @Inject(MAILER_SERVICE) private readonly mailerService: IMailerService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.appName = this.configService.getOrThrow<string>('brand.name');
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case MAIL_JOB.VERIFICATION_EMAIL:
        await this.processVerificationEmail(job.data as VerificationEmailJob);
        break;
      case MAIL_JOB.RESEND_VERIFICATION_EMAIL:
        await this.processResendVerificationEmail(job.data as VerificationEmailJob);
        break;
      default:
        this.logger.warn(`Unhandled mail job type: ${job.name}`);
    }
  }

  private async processVerificationEmail(data: VerificationEmailJob): Promise<void> {
    const html = await renderVerificationEmail(data.firstName, data.verifyUrl);
    await this.mailerService.sendEmail({
      to: data.to,
      subject: MAIL_SUBJECT.VERIFICATION_EMAIL(this.appName),
      html,
    });
    this.logger.log(`Verification email sent → ${data.to}`);
  }

  private async processResendVerificationEmail(data: VerificationEmailJob): Promise<void> {
    const html = await renderResendVerificationEmail(data.firstName, data.verifyUrl, this.appName);
    await this.mailerService.sendEmail({
      to: data.to,
      subject: MAIL_SUBJECT.RESEND_VERIFICATION_EMAIL(this.appName),
      html,
    });
    this.logger.log(`Resend verification email sent → ${data.to}`);
  }
}
