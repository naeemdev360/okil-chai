import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthTokensResponse } from '@repo/shared';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  clearSessionCookies,
  readRefreshCookie,
  setSessionCookies,
} from '../../common/utils/auth-cookie.util';
import { USERS_SERVICE, type IUsersService } from '../users/interfaces/users.interfaces';
import { AccessTokenDto } from './dto/auth-tokens.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LawyerSignUpDto } from './dto/lawyer-signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
    private readonly configService: ConfigService,
  ) {}

  /** Place the refresh token in an httpOnly cookie and return only the access token to the client. */
  private setRefreshCookieAndReturnAccess(tokens: AuthTokensResponse, res: Response): AccessTokenDto {
    setSessionCookies(res, tokens.refreshToken, this.configService);
    return { accessToken: tokens.accessToken };
  }

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new client account' })
  @ApiResponse({ status: 201, type: AccessTokenDto })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async signUpUser(
    @Body() dto: UserSignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenDto> {
    const tokens = await this.authService.signUpUser(dto);
    return this.setRefreshCookieAndReturnAccess(tokens, res);
  }

  @Post('signup/lawyer')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new lawyer account (pending admin verification)' })
  @ApiResponse({ status: 201, type: AccessTokenDto })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async signUpLawyer(
    @Body() dto: LawyerSignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenDto> {
    const tokens = await this.authService.signUpLawyer(dto);
    return this.setRefreshCookieAndReturnAccess(tokens, res);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AccessTokenDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @CurrentUser() user: ValidatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenDto> {
    const tokens = await this.authService.login(user);
    return this.setRefreshCookieAndReturnAccess(tokens, res);
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
    // Set the refresh cookie on the shared parent domain, then send the user to their
    // portal — the SPA silently mints an access token on load. No tokens in the URL.
    setSessionCookies(res, tokens.refreshToken, this.configService);
    res.redirect(this.authService.getFrontendCallbackUrl(user.roles));
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
  @ApiOperation({ summary: 'Rotate the refresh-token cookie and issue a new access token' })
  @ApiResponse({ status: 200, type: AccessTokenDto })
  @ApiResponse({ status: 401, description: 'Session expired or revoked' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenDto> {
    const rawRefreshToken = readRefreshCookie(req);
    if (!rawRefreshToken) throw new UnauthorizedException('Missing refresh token');
    try {
      const tokens = await this.authService.refreshTokens(rawRefreshToken);
      return this.setRefreshCookieAndReturnAccess(tokens, res);
    } catch (error) {
      // Stale/expired session — clear cookies (incl. the hint) so the SPA stops retrying on reload.
      if (error instanceof UnauthorizedException) clearSessionCookies(res, this.configService);
      throw error;
    }
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Request a password reset email',
    description: 'Always returns 204 regardless of whether the email exists — prevents email enumeration. Only works for local (email/password) accounts.',
  })
  @ApiResponse({ status: 204, description: 'Reset email queued if the address has a local account' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reset password using the one-time token from the reset email' })
  @ApiResponse({ status: 204, description: 'Password updated and all sessions revoked' })
  @ApiResponse({ status: 401, description: 'Invalid or expired reset token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke the current session and clear the refresh cookie (idempotent)' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const rawRefreshToken = readRefreshCookie(req);
    if (rawRefreshToken) await this.authService.logout(rawRefreshToken);
    clearSessionCookies(res, this.configService);
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
