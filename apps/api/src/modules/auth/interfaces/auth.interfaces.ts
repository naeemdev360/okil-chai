import type { AuthTokensResponse, LawyerSignUpRequest, UserSignUpRequest } from '@repo/shared';
import { Role } from '@repo/shared';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

// ── JWT / request types ────────────────────────────────────────────────────

export interface JwtPayload {
  readonly sub: string;
  readonly roles: readonly Role[];
  readonly isVerified: boolean;
}

/** Shape attached to req.user after JWT validation. */
export interface RequestUser {
  readonly userId: string;
  readonly roles: readonly Role[];
  readonly isVerified: boolean;
}

/** Minimal user object returned by Passport strategies and passed into service calls. */
export interface ValidatedUser {
  readonly userId: string;
  readonly roles: readonly Role[];
  readonly isVerified: boolean;
}

// ── Repository contracts ────────────────────────────────────────────────────

export interface LocalIdentity {
  readonly userId: string;
  readonly passwordHash: string;
}

export interface GoogleUserPayload {
  readonly googleSub: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatarUrl: string | null;
  readonly intentRole: Role;
}

export interface CreateLocalUserInput {
  readonly email: string;
  readonly passwordHash: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface CreateLocalLawyerInput {
  readonly email: string;
  readonly passwordHash: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface SessionRecord {
  readonly id: string;
  readonly userId: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface UserEmailInfo {
  readonly email: string;
  readonly firstName: string;
  readonly isVerified: boolean;
  readonly roles: readonly Role[];
}

export interface PasswordResetUserInfo {
  readonly userId: string;
  readonly firstName: string;
  readonly roles: readonly Role[];
}

// ── Auth repository contract ──────────────────────────────────────────────────
export interface IAuthRepository {
  findLocalIdentity(email: string): Promise<LocalIdentity | null>;
  getValidatedUser(userId: string): Promise<ValidatedUser>;
  createLocalUser(input: CreateLocalUserInput): Promise<ValidatedUser>;
  createLocalLawyer(input: CreateLocalLawyerInput): Promise<ValidatedUser>;
  findOrCreateGoogleUser(payload: GoogleUserPayload): Promise<ValidatedUser>;
  createSession(userId: string, refreshTokenHash: string): Promise<void>;
  findActiveSession(refreshTokenHash: string): Promise<SessionRecord | null>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllUserSessions(userId: string): Promise<void>;
  createVerificationToken(userId: string): Promise<string>;
  consumeVerificationToken(rawToken: string): Promise<string | null>;
  markUserVerified(userId: string): Promise<void>;
  getUserEmailInfo(userId: string): Promise<UserEmailInfo | null>;
  invalidateVerificationTokens(userId: string): Promise<void>;
  findUserForPasswordReset(email: string): Promise<PasswordResetUserInfo | null>;
  createPasswordResetToken(userId: string): Promise<string>;
  consumePasswordResetToken(rawToken: string): Promise<string | null>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;
}

// ── Service contract ────────────────────────────────────────────────────────

export interface IAuthService {
  signUpUser(input: UserSignUpRequest): Promise<AuthTokensResponse>;
  signUpLawyer(input: LawyerSignUpRequest): Promise<AuthTokensResponse>;
  login(user: ValidatedUser): Promise<AuthTokensResponse>;
  handleGoogleAuth(user: ValidatedUser): Promise<AuthTokensResponse>;
  refreshTokens(rawRefreshToken: string): Promise<AuthTokensResponse>;
  logout(rawRefreshToken: string): Promise<void>;
  verifyEmail(rawToken: string): Promise<void>;
  resendVerificationEmail(userId: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(rawToken: string, newPassword: string): Promise<void>;
  getFrontendCallbackUrl(roles: readonly Role[]): string;
}
