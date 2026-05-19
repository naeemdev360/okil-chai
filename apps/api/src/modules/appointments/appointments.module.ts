import { Module } from '@nestjs/common';
import { LawyersModule } from '../lawyers/lawyers.module';
import { PaymentsModule } from '../payments/payments.module';
import { APPOINTMENTS_REPOSITORY, APPOINTMENTS_SERVICE } from './interfaces/appointments.interfaces';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { BkashCallbackController } from './bkash-callback.controller';

@Module({
  imports: [LawyersModule, PaymentsModule],
  controllers: [AppointmentsController, BkashCallbackController],
  providers: [
    { provide: APPOINTMENTS_REPOSITORY, useClass: AppointmentsRepository },
    { provide: APPOINTMENTS_SERVICE, useClass: AppointmentsService },
  ],
  exports: [APPOINTMENTS_SERVICE],
})
export class AppointmentsModule {}
