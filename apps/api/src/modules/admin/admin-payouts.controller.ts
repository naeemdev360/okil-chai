import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { PendingPayoutItem } from '@repo/shared';
import { AdminOnly } from '../../common/decorators/admin-only.decorator';
import {
  PAYMENTS_REPOSITORY,
  type IPaymentsRepository,
} from '../payments/interfaces/payments.interfaces';
import { ApprovePayoutsDto } from './dto/approve-payouts.dto';

@ApiTags('Admin')
@AdminOnly()
@Controller('admin/payouts')
export class AdminPayoutsController {
  constructor(
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: IPaymentsRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List pending lawyer payouts grouped by lawyer' })
  @ApiResponse({ status: 200, description: 'Pending payout summaries' })
  listPendingPayouts(): Promise<PendingPayoutItem[]> {
    return this.paymentsRepository.listPendingPayouts();
  }

  @Patch('approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark a set of payments as paid out (manual bank transfer)' })
  @ApiResponse({ status: 204, description: 'Payouts marked as processed' })
  approvePayouts(@Body() dto: ApprovePayoutsDto): Promise<void> {
    return this.paymentsRepository.markPayoutsProcessed(dto.paymentIds);
  }
}
