import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { FavouritesModule } from '../favourites/favourites.module';
import { LawyersModule } from '../lawyers/lawyers.module';
import { MessagesModule } from '../messages/messages.module';
import { PaymentsModule } from '../payments/payments.module';
import { ClientDashboardController } from './client-dashboard.controller';
import { ClientPaymentsController } from './client-payments.controller';
import { LawyerDashboardController } from './lawyer-dashboard.controller';

@Module({
  imports: [LawyersModule, AppointmentsModule, PaymentsModule, FavouritesModule, MessagesModule],
  controllers: [LawyerDashboardController, ClientPaymentsController, ClientDashboardController],
})
export class DashboardModule {}
