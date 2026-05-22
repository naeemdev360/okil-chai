import type { Http } from '../core/http';
import type {
  AuthTokens,
  ForgotPasswordDto,
  LawyerSignupDto,
  LoginDto,
  RefreshDto,
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

    refresh: (dto: RefreshDto) =>
      http.post<AuthTokens>('/auth/refresh', dto),

    logout: (dto: RefreshDto) =>
      http.post('/auth/logout', dto),

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
