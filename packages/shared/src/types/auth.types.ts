/** Issued internally by the auth service; the refresh token is delivered to the client as an httpOnly cookie, never in the body. */
export interface AuthTokensResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/** Client-facing auth response. The refresh token lives in an httpOnly cookie, so only the access token is returned. */
export interface AccessTokenResponse {
  readonly accessToken: string;
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
