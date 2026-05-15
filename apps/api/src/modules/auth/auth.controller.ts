import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { USERS_SERVICE, type IUsersService } from '../users/interfaces/users.interfaces';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { LawyerSignUpDto } from './dto/lawyer-signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserSignUpDto } from './dto/signup.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AUTH_SERVICE,
  type IAuthService,
  type RequestUser,
  type ValidatedUser,
} from './interfaces/auth.interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
  ) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new client account' })
  @ApiResponse({ status: 201, type: AuthTokensDto })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  signUpUser(@Body() dto: UserSignUpDto): Promise<AuthTokensDto> {
    return this.authService.signUpUser(dto);
  }

  @Post('signup/lawyer')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new lawyer account (pending admin verification)' })
  @ApiResponse({ status: 201, type: AuthTokensDto })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  signUpLawyer(@Body() dto: LawyerSignUpDto): Promise<AuthTokensDto> {
    return this.authService.signUpLawyer(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@CurrentUser() user: ValidatedUser): Promise<AuthTokensDto> {
    return this.authService.login(user);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Start Google OAuth flow',
    description: 'Pass `?role=LAWYER` to sign up as a lawyer, omit for client. Redirects to Google.',
  })
  googleAuth(): void {
    // Passport redirects to Google — body intentionally empty
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  async googleCallback(
    @CurrentUser() user: ValidatedUser,
    @Res() res: Response,
  ): Promise<void> {
    const tokens = await this.authService.handleGoogleAuth(user);
    const baseUrl = this.authService.getFrontendCallbackUrl(user.roles);
    res.redirect(`${baseUrl}/auth/callback?at=${tokens.accessToken}&rt=${tokens.refreshToken}`);
  }

  @Get('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address using the one-time token sent on signup' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired verification link' })
  async verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resend a new verification link to the authenticated user' })
  @ApiResponse({ status: 204, description: 'Verification email queued' })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async resendVerification(@CurrentUser() user: RequestUser): Promise<void> {
    await this.authService.resendVerificationEmail(user.userId);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue a new access token' })
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Session expired or revoked' })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke the current session (idempotent)' })
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.authService.logout(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the full profile of the authenticated user' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getMe(@CurrentUser() user: RequestUser): ReturnType<IUsersService['getMyProfile']> {
    return this.usersService.getMyProfile(user.userId);
  }
}
