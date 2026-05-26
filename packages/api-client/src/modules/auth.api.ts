import type { Http } from '../core/http';
import type {
  AuthTokens,
  ForgotPasswordDto,
  LawyerSignupDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  UserProfile,
} from '../types/auth.types';

export function createAuthApi(http: Http) {
  return {
    signup: (dto: SignupDto) =>
      http.post<AuthTokens>('/auth/signup', dto),

    signupLawyer: (dto: LawyerSignupDto) =>
      http.post<AuthTokens>('/auth/signup/lawyer', dto),

    verifyEmail: (token: string) =>
      http.get<{ message: string }>('/auth/verify-email', { params: { token } }),

    login: (dto: LoginDto) =>
      http.post<AuthTokens>('/auth/login', dto),

    // Refresh token is read from the httpOnly cookie, so no body is sent.
    refresh: () =>
      http.post<AuthTokens>('/auth/refresh'),

    logout: () =>
      http.post('/auth/logout'),

    forgotPassword: (dto: ForgotPasswordDto) =>
      http.post('/auth/forgot-password', dto),

    resetPassword: (dto: ResetPasswordDto) =>
      http.post('/auth/reset-password', dto),

    resendVerification: () =>
      http.post<{ message: string }>('/auth/resend-verification'),

    getMe: () =>
      http.get<UserProfile>('/auth/me'),
  } as const;
}
