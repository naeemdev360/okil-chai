import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { UserProfileResponse } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { USERS_SERVICE, type IUsersService } from './interfaces/users.interfaces';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE) private readonly usersService: IUsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Return the full profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getMyProfile(@CurrentUser() user: RequestUser): Promise<UserProfileResponse> {
    return this.usersService.getMyProfile(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the authenticated user\'s profile' })
  @ApiResponse({ status: 200, description: 'Updated user profile' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  updateMyProfile(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserProfileResponse> {
    return this.usersService.updateMyProfile(user.userId, dto);
  }
}
