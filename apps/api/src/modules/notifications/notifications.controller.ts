import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { PaginatedNotificationsResponse } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import {
  NOTIFICATIONS_SERVICE,
  type INotificationsService,
} from './interfaces/notifications.interfaces';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: INotificationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for the authenticated user (newest first)' })
  @ApiResponse({ status: 200, description: 'Paginated notifications with unread count' })
  getNotifications(
    @CurrentUser() user: RequestUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedNotificationsResponse> {
    return this.notificationsService.getForUser(user.userId, query);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark a single notification as read' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Marked as read' })
  markAsRead(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.notificationsService.markAsRead(id, user.userId);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 204, description: 'All notifications marked as read' })
  markAllAsRead(@CurrentUser() user: RequestUser): Promise<void> {
    return this.notificationsService.markAllAsRead(user.userId);
  }
}
