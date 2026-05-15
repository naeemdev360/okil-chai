import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { IMailerService, SendEmailOptions } from './interfaces/mailer.interfaces';

@Injectable()
export class MailerService implements IMailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(configService: ConfigService) {
    const secure = configService.get<boolean>('mailer.secure') ?? false;
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow<string>('mailer.host'),
      port: configService.getOrThrow<number>('mailer.port'),
      secure,
      // On STARTTLS ports (587, 25), refuse to send credentials unless the upgrade succeeds.
      requireTLS: !secure,
      auth: {
        user: configService.getOrThrow<string>('mailer.user'),
        pass: configService.getOrThrow<string>('mailer.pass'),
      },
    });

    const fromName = configService.getOrThrow<string>('mailer.fromName');
    const fromEmail = configService.getOrThrow<string>('mailer.fromEmail');
    this.from = `"${fromName}" <${fromEmail}>`;
  }

  async verify(): Promise<void> {
    await this.transporter.verify();
  }

  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Email sent → ${to} | ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email → ${to}`, error);
      throw error;
    }
  }
}
