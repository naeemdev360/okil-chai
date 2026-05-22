import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentsModule } from '../payments/payments.module';
import { AdminController } from './admin.controller';
import { AdminPayoutsController } from './admin-payouts.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';
import { ADMIN_REPOSITORY, ADMIN_SERVICE } from './interfaces/admin.interfaces';

@Module({
  imports: [DatabaseModule, PaymentsModule],
  controllers: [AdminController, AdminPayoutsController],
  providers: [
    { provide: ADMIN_REPOSITORY, useClass: AdminRepository },
    { provide: ADMIN_SERVICE, useClass: AdminService },
  ],
})
export class AdminModule {}
