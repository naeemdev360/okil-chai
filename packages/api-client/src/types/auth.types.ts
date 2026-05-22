import type { Role } from '@repo/shared';

export interface LawyerSignupDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roles: readonly Role[];
  readonly avatarUrl: string | null;
  readonly isVerified: boolean;
  readonly onboardingComplete: boolean;
  readonly onboardingStep: number | null;
}

export interface SignupDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface LoginDto {
  readonly email: string;
  readonly password: string;
}

export interface RefreshDto {
  readonly refreshToken: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface ForgotPasswordDto {
  readonly email: string;
}

export interface ResetPasswordDto {
  readonly token: string;
  readonly newPassword: string;
}

