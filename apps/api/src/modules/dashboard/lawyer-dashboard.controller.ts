import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type {
  EarningsSummaryResponse,
  LawyerDashboardResponse,
  PaginatedPaymentHistoryResponse,
} from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import {
  LAWYERS_SERVICE,
  type ILawyersService,
} from '../lawyers/interfaces/lawyers.interfaces';
import {
  PAYMENTS_REPOSITORY,
  type IPaymentsRepository,
} from '../payments/interfaces/payments.interfaces';
import {
  APPOINTMENTS_REPOSITORY,
  type IAppointmentsRepository,
} from '../appointments/interfaces/appointments.interfaces';

@ApiTags('Lawyers')
@ApiBearerAuth()
@Controller('lawyers')
@Roles(Role.LAWYER)
@UseGuards(RolesGuard)
export class LawyerDashboardController {
  constructor(
    @Inject(LAWYERS_SERVICE)
    private readonly lawyersService: ILawyersService,
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: IPaymentsRepository,
    @Inject(APPOINTMENTS_REPOSITORY)
    private readonly appointmentsRepository: IAppointmentsRepository,
  ) {}

  @Get('me/dashboard')
  @ApiOperation({ summary: 'Lawyer dashboard: earnings summary, upcoming appointments, monthly stats' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  async getDashboard(@CurrentUser() user: RequestUser): Promise<LawyerDashboardResponse> {
    const profile = await this.lawyersService.getProfile(user.userId);

    const [earnings, upcomingRows, monthlyStats] = await Promise.all([
      this.paymentsRepository.getEarningsSummaryByLawyerProfileId(profile.id),
      this.appointmentsRepository.findUpcomingByLawyerProfileId(profile.id, 5),
      this.appointmentsRepository.getMonthlyStatsByLawyerProfileId(profile.id),
    ]);

    return {
      earnings,
      upcomingAppointments: upcomingRows.map((row) => ({
        id: row.id,
        clientId: row.clientId,
        lawyerId: row.lawyerId,
        consultationType: row.consultationType,
        caseCategory: row.caseCategory,
        startAt: row.startAt,
        endAt: row.endAt,
        status: row.status,
        clientNotes: row.clientNotes,
        client: {
          id: row.clientId,
          firstName: row.clientFirstName,
          lastName: row.clientLastName,
          photoUrl: row.clientAvatarUrl,
        },
        lawyer: {
          id: row.lawyerId,
          firstName: row.lawyerFirstName,
          lastName: row.lawyerLastName,
          photoUrl: row.lawyerPhotoUrl,
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
      recentActivity: {
        completedThisMonth: monthlyStats.completedThisMonth,
        cancelledThisMonth: monthlyStats.cancelledThisMonth,
        newReviewsThisMonth: 0,
      },
    };
  }

  @Get('me/payments')
  @ApiOperation({ summary: 'Lawyer earnings history (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated payment history' })
  async getLawyerPayments(
    @CurrentUser() user: RequestUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedPaymentHistoryResponse> {
    const profile = await this.lawyersService.getProfile(user.userId);
    const { items, total } = await this.paymentsRepository.findHistoryByLawyerProfileId(
      profile.id,
      query,
    );

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page ?? 1, query.limit ?? 20),
    };
  }

  @Get('me/earnings')
  @ApiOperation({ summary: 'Lawyer earnings summary totals' })
  @ApiResponse({ status: 200, description: 'Earnings summary' })
  async getEarningsSummary(@CurrentUser() user: RequestUser): Promise<EarningsSummaryResponse> {
    const profile = await this.lawyersService.getProfile(user.userId);
    return this.paymentsRepository.getEarningsSummaryByLawyerProfileId(profile.id);
  }
}
