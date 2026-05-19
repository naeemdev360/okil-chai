import { Module } from '@nestjs/common';
import { PAYMENT_GATEWAY, PAYMENTS_REPOSITORY } from './interfaces/payments.interfaces';
import { BkashGateway } from './bkash.service';
import { PaymentsRepository } from './payments.repository';

@Module({
  providers: [
    { provide: PAYMENT_GATEWAY, useClass: BkashGateway },
    { provide: PAYMENTS_REPOSITORY, useClass: PaymentsRepository },
  ],
  exports: [PAYMENT_GATEWAY, PAYMENTS_REPOSITORY],
})
export class PaymentsModule {}
