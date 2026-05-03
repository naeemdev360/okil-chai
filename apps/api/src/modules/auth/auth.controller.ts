import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login (mock — accepts any credentials)' })
  @ApiResponse({ status: 200, type: AuthTokensDto })
  login(@Body() dto: LoginDto): AuthTokensDto {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Headers('authorization') authHeader: string | undefined): UserProfileDto {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    return this.authService.getMe(authHeader.slice(7));
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  logout(): Record<string, never> {
    this.authService.logout();
    return {};
  }
}
