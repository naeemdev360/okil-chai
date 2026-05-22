import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';
import {
  NOTIFICATIONS_REPOSITORY,
  NOTIFICATIONS_SERVICE,
} from './interfaces/notifications.interfaces';

@Module({
  controllers: [NotificationsController],
  providers: [
    { provide: NOTIFICATIONS_REPOSITORY, useClass: NotificationsRepository },
    { provide: NOTIFICATIONS_SERVICE, useClass: NotificationsService },
  ],
  exports: [NOTIFICATIONS_SERVICE],
})
export class NotificationsModule {}
