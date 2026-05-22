import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { LawyersModule } from '../lawyers/lawyers.module';
import { PaymentsModule } from '../payments/payments.module';
import { LawyerDashboardController } from './lawyer-dashboard.controller';
import { ClientPaymentsController } from './client-payments.controller';

@Module({
  imports: [LawyersModule, AppointmentsModule, PaymentsModule],
  controllers: [LawyerDashboardController, ClientPaymentsController],
})
export class DashboardModule {}
