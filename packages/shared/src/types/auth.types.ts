export interface AuthTokensResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface UserSignUpRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface LawyerSignUpRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RefreshTokenRequest {
  readonly refreshToken: string;
}

export interface ForgotPasswordRequest {
  readonly email: string;
}

export interface ResetPasswordRequest {
  readonly token: string;
  readonly newPassword: string;
}
