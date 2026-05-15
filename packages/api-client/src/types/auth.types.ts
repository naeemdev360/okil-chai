import type { Role } from '@repo/shared';

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role;
  readonly avatarUrl: string | null;
}

export interface SignupDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role.CLIENT | Role.LAWYER;
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

export interface LawyerOnboardingDto {
  readonly barNumber: string;
  readonly specializations: readonly string[];
  readonly yearsOfExperience: number;
  readonly bio: string;
  readonly hourlyRate: number;
  readonly languages: readonly string[];
}
