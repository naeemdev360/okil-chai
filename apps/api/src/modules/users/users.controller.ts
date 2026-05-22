import {
  Body,
  Controller,
  Delete,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { PaginatedLawyersResponse, UserProfileResponse } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { USERS_SERVICE, type IUsersService } from './interfaces/users.interfaces';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE) private readonly usersService: IUsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Return the full profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getMyProfile(@CurrentUser() user: RequestUser): Promise<UserProfileResponse> {
    return this.usersService.getMyProfile(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: "Update the authenticated user's profile" })
  @ApiResponse({ status: 200, description: 'Updated user profile' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  updateMyProfile(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserProfileResponse> {
    return this.usersService.updateMyProfile(user.userId, dto);
  }

  @Get('me/favourites')
  @ApiOperation({ summary: 'List saved/favourite lawyers (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of favourite lawyers' })
  getFavourites(
    @CurrentUser() user: RequestUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedLawyersResponse> {
    return this.usersService.getFavourites(user.userId, query);
  }

  @Post('me/favourites/:lawyerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Save a lawyer to favourites' })
  @ApiParam({ name: 'lawyerId', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Lawyer saved (idempotent)' })
  addFavourite(
    @CurrentUser() user: RequestUser,
    @Param('lawyerId', ParseUUIDPipe) lawyerId: string,
  ): Promise<void> {
    return this.usersService.addFavourite(user.userId, lawyerId);
  }

  @Delete('me/favourites/:lawyerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a lawyer from favourites' })
  @ApiParam({ name: 'lawyerId', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Lawyer removed (idempotent)' })
  removeFavourite(
    @CurrentUser() user: RequestUser,
    @Param('lawyerId', ParseUUIDPipe) lawyerId: string,
  ): Promise<void> {
    return this.usersService.removeFavourite(user.userId, lawyerId);
  }
}
