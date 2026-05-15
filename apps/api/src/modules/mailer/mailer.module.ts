import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { MAIL_QUEUE } from './mail.constants';
import { MAIL_PRODUCER, MAILER_SERVICE } from './interfaces/mailer.interfaces';
import { MailConsumer } from './mail.consumer';
import { MailProducer } from './mail.producer';
import { MailerHealthService } from './mailer.health';
import { MailerService } from './mailer.service';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: MAIL_QUEUE })],
  providers: [
    { provide: MAILER_SERVICE, useClass: MailerService },
    MailProducer,
    { provide: MAIL_PRODUCER, useExisting: MailProducer },
    MailConsumer,
    MailerHealthService,
  ],
  exports: [MAILER_SERVICE, MAIL_PRODUCER],
})
export class MailerModule {}
