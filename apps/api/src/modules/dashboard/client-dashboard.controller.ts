import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentStatus, Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import {
  APPOINTMENTS_REPOSITORY,
  type IAppointmentsRepository,
} from '../appointments/interfaces/appointments.interfaces';
import {
  FAVOURITES_REPOSITORY,
  type IFavouritesRepository,
} from '../favourites/interfaces/favourites.interfaces';
import {
  MESSAGES_REPOSITORY,
  type IMessagesRepository,
} from '../messages/interfaces/messages.interfaces';
import {
  PAYMENTS_REPOSITORY,
  type IPaymentsRepository,
} from '../payments/interfaces/payments.interfaces';

export interface ClientDashboardStats {
  readonly upcomingCount: number;
  readonly completedCount: number;
  readonly savedLawyersCount: number;
  readonly unreadMessagesCount: number;
  readonly totalAmountSpent: string;
}

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard/client')
@Roles(Role.CLIENT)
@UseGuards(RolesGuard)
export class ClientDashboardController {
  constructor(
    @Inject(APPOINTMENTS_REPOSITORY)
    private readonly appointmentsRepository: IAppointmentsRepository,
    @Inject(FAVOURITES_REPOSITORY)
    private readonly favouritesRepository: IFavouritesRepository,
    @Inject(MESSAGES_REPOSITORY)
    private readonly messagesRepository: IMessagesRepository,
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: IPaymentsRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Client dashboard summary stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  async getClientStats(@CurrentUser() user: RequestUser): Promise<ClientDashboardStats> {
    const [upcoming, completed, savedLawyersCount, unreadMessagesCount, totalAmountSpent] =
      await Promise.all([
        this.appointmentsRepository.findByParticipant(user.userId, false, {
          status: AppointmentStatus.CONFIRMED,
          upcoming: true,
          limit: 1,
        }),
        this.appointmentsRepository.findByParticipant(user.userId, false, {
          status: AppointmentStatus.COMPLETED,
          limit: 1,
        }),
        this.favouritesRepository.countByUserId(user.userId),
        this.messagesRepository.countUnreadByUserId(user.userId),
        this.paymentsRepository.sumAmountByClientId(user.userId),
      ]);

    return {
      upcomingCount: upcoming.total,
      completedCount: completed.total,
      savedLawyersCount,
      unreadMessagesCount,
      totalAmountSpent: totalAmountSpent ?? '0',
    };
  }
}
