import { Controller, Get, Inject, Logger, Query, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { Public } from '../../common/decorators/public.decorator';
import {
  APPOINTMENTS_SERVICE,
  type IAppointmentsService,
} from './interfaces/appointments.interfaces';

class BkashCallbackQuery {
  @IsString()
  paymentID!: string;

  @IsIn(['success', 'failure', 'cancel'])
  status!: 'success' | 'failure' | 'cancel';

  @IsOptional()
  @IsString()
  apiVersion?: string;
}

@ApiExcludeController()
@Controller('payments/bkash')
@Public()
export class BkashCallbackController {
  private readonly logger = new Logger(BkashCallbackController.name);

  constructor(
    @Inject(APPOINTMENTS_SERVICE)
    private readonly appointmentsService: IAppointmentsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('callback')
  @Redirect()
  async handleCallback(@Query() query: BkashCallbackQuery): Promise<{ url: string }> {
    const frontendUrl =
      this.configService.get<string>('app.corsOrigin') ?? 'http://localhost:3000';

    if (query.status !== 'success') {
      await this.appointmentsService.handlePaymentFailure(query.paymentID).catch((err: unknown) => {
        this.logger.error('Failed to handle payment failure', err);
      });
      return { url: `${frontendUrl}/payment-failed?reason=${query.status}` };
    }

    try {
      const appointmentId = await this.appointmentsService.confirmPayment(query.paymentID);
      return { url: `${frontendUrl}/appointments/${appointmentId}?payment=success` };
    } catch (err: unknown) {
      this.logger.error('Failed to confirm bKash payment', err);
      return { url: `${frontendUrl}/payment-failed?reason=execute_error` };
    }
  }
}
