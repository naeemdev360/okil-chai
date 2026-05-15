import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokensResponse, LawyerSignUpRequest, UserSignUpRequest } from '@repo/shared';
import { Role } from '@repo/shared';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MAIL_PRODUCER, type IMailProducer } from '../mailer/interfaces/mailer.interfaces';
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
  type IAuthService,
  type JwtPayload,
  type ValidatedUser,
} from './interfaces/auth.interfaces';

const BCRYPT_COST = 12;

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository,
    @Inject(MAIL_PRODUCER) private readonly mailProducer: IMailProducer,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUpUser(input: UserSignUpRequest): Promise<AuthTokensResponse> {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
    const user = await this.repo.createLocalUser({
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });
    await this.queueVerificationEmail(user.userId, input.email, input.firstName, Role.CLIENT);
    return this.issueTokenPair(user);
  }

  async signUpLawyer(input: LawyerSignUpRequest): Promise<AuthTokensResponse> {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
    const user = await this.repo.createLocalLawyer({
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });
    await this.queueVerificationEmail(user.userId, input.email, input.firstName, Role.LAWYER);
    return this.issueTokenPair(user);
  }

  async login(user: ValidatedUser): Promise<AuthTokensResponse> {
    return this.issueTokenPair(user);
  }

  async handleGoogleAuth(user: ValidatedUser): Promise<AuthTokensResponse> {
    return this.issueTokenPair(user);
  }

  async refreshTokens(rawRefreshToken: string): Promise<AuthTokensResponse> {
    const hash = sha256(rawRefreshToken);
    const session = await this.repo.findActiveSession(hash);
    if (!session) throw new UnauthorizedException('Session expired or revoked');

    await this.repo.revokeSession(session.id);
    const user = await this.repo.getValidatedUser(session.userId);
    return this.issueTokenPair(user);
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const hash = sha256(rawRefreshToken);
    const session = await this.repo.findActiveSession(hash);
    if (session) await this.repo.revokeSession(session.id);
  }

  async verifyEmail(rawToken: string): Promise<void> {
    const userId = await this.repo.consumeVerificationToken(rawToken);
    if (!userId) throw new UnauthorizedException('Invalid or expired verification link');
    await this.repo.markUserVerified(userId);
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.repo.getUserEmailInfo(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) throw new BadRequestException('Email is already verified');

    await this.repo.invalidateVerificationTokens(userId);
    await this.queueResendVerificationEmail(userId, user.email, user.firstName, user.roles);
  }

  getFrontendCallbackUrl(roles: readonly Role[]): string {
    return this.resolvePortalUrl(roles.includes(Role.LAWYER) ? Role.LAWYER : Role.CLIENT);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async queueVerificationEmail(
    userId: string,
    email: string,
    firstName: string,
    role: Role,
  ): Promise<void> {
    const rawToken = await this.repo.createVerificationToken(userId);
    const portalUrl = this.resolvePortalUrl(role);
    await this.mailProducer.sendVerificationEmail({
      to: email,
      firstName,
      verifyUrl: `${portalUrl}/auth/verify-email?token=${rawToken}`,
    });
  }

  private async queueResendVerificationEmail(
    userId: string,
    email: string,
    firstName: string,
    roles: readonly Role[],
  ): Promise<void> {
    const rawToken = await this.repo.createVerificationToken(userId);
    const portalUrl = this.resolvePortalUrl(roles.includes(Role.LAWYER) ? Role.LAWYER : Role.CLIENT);
    await this.mailProducer.sendResendVerificationEmail({
      to: email,
      firstName,
      verifyUrl: `${portalUrl}/auth/verify-email?token=${rawToken}`,
    });
  }

  private resolvePortalUrl(role: Role): string {
    return role === Role.LAWYER
      ? this.configService.get<string>('auth.lawyerPortalUrl', 'http://localhost:3002')
      : this.configService.get<string>('auth.clientPortalUrl', 'http://localhost:3001');
  }

  private async issueTokenPair(user: ValidatedUser): Promise<AuthTokensResponse> {
    const accessToken = this.signAccessToken(user);
    const { refreshToken, hash } = this.generateRefreshToken();
    await this.repo.createSession(user.userId, hash);
    return { accessToken, refreshToken };
  }

  private signAccessToken(user: ValidatedUser): string {
    const payload: JwtPayload = {
      sub: user.userId,
      roles: [...user.roles],
      isVerified: user.isVerified,
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(): { refreshToken: string; hash: string } {
    const refreshToken = crypto.randomUUID();
    return { refreshToken, hash: sha256(refreshToken) };
  }
}
