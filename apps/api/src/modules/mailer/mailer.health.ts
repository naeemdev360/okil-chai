import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MAILER_SERVICE, type IMailerService } from './interfaces/mailer.interfaces';

@Injectable()
export class MailerHealthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MailerHealthService.name);

  constructor(@Inject(MAILER_SERVICE) private readonly mailerService: IMailerService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.mailerService.verify();
      this.logger.log('Mailer SMTP connection verified ✓');
    } catch (error) {
      this.logger.error(
        'Cannot reach the mail server — application will not start.',
        error instanceof Error ? error.stack : String(error),
      );
      process.exit(1);
    }
  }
}
