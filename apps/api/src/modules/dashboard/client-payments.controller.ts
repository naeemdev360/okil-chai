import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { PaginatedPaymentHistoryResponse } from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import {
  PAYMENTS_REPOSITORY,
  type IPaymentsRepository,
} from '../payments/interfaces/payments.interfaces';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@Roles(Role.CLIENT)
@UseGuards(RolesGuard)
export class ClientPaymentsController {
  constructor(
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: IPaymentsRepository,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Client payment history (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated payment history' })
  async getClientPayments(
    @CurrentUser() user: RequestUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedPaymentHistoryResponse> {
    const { items, total } = await this.paymentsRepository.findHistoryByClientId(
      user.userId,
      query,
    );

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page ?? 1, query.limit ?? 20),
    };
  }
}
