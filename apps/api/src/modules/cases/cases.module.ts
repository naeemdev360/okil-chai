import { Module } from '@nestjs/common';
import { LawyersModule } from '../lawyers/lawyers.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { CasesController } from './cases.controller';
import { CasesRepository } from './cases.repository';
import { CasesService } from './cases.service';
import { CASES_REPOSITORY, CASES_SERVICE } from './interfaces/cases.interfaces';

@Module({
  imports: [LawyersModule, NotificationsModule, UsersModule],
  controllers: [CasesController],
  providers: [
    { provide: CASES_REPOSITORY, useClass: CasesRepository },
    { provide: CASES_SERVICE, useClass: CasesService },
  ],
  exports: [CASES_SERVICE],
})
export class CasesModule {}
