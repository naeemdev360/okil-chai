import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type {
  ConversationSummary,
  MessageResponse,
  PaginatedMessagesResponse,
} from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { SendMessageDto } from './dto/send-message.dto';
import {
  MESSAGES_SERVICE,
  type IMessagesService,
} from './interfaces/messages.interfaces';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(
    @Inject(MESSAGES_SERVICE) private readonly messagesService: IMessagesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to another user' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  @ApiResponse({ status: 400, description: 'Cannot message yourself' })
  sendMessage(
    @CurrentUser() user: RequestUser,
    @Body() dto: SendMessageDto,
  ): Promise<MessageResponse> {
    return this.messagesService.sendMessage(user.userId, {
      receiverId: dto.receiverId,
      content: dto.content,
      appointmentId: dto.appointmentId,
    });
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations (inbox) for the current user' })
  @ApiResponse({ status: 200, description: 'Conversation list' })
  getConversations(@CurrentUser() user: RequestUser): Promise<ConversationSummary[]> {
    return this.messagesService.getConversations(user.userId);
  }

  @Get('conversations/:otherUserId')
  @ApiOperation({ summary: 'Get paginated message thread with a specific user' })
  @ApiParam({ name: 'otherUserId', type: String, format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated message thread' })
  getThread(
    @CurrentUser() user: RequestUser,
    @Param('otherUserId', ParseUUIDPipe) otherUserId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedMessagesResponse> {
    return this.messagesService.getThread(user.userId, otherUserId, query);
  }

  @Patch('conversations/:otherUserId/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all messages from a user as read' })
  @ApiParam({ name: 'otherUserId', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Messages marked as read' })
  markThreadAsRead(
    @CurrentUser() user: RequestUser,
    @Param('otherUserId', ParseUUIDPipe) otherUserId: string,
  ): Promise<void> {
    return this.messagesService.markThreadAsRead(user.userId, otherUserId);
  }
}
