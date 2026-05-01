import type { Http } from '../core/http';
import type {
  AuthTokens,
  LawyerOnboardingDto,
  LoginDto,
  RefreshDto,
  SignupDto,
} from '../types/auth.types';

export function createAuthApi(http: Http) {
  return {
    signup: (dto: SignupDto) =>
      http.post<AuthTokens>('/auth/signup', dto),

    login: (dto: LoginDto) =>
      http.post<AuthTokens>('/auth/login', dto),

    refresh: (dto: RefreshDto) =>
      http.post<AuthTokens>('/auth/refresh', dto),

    logout: () =>
      http.post('/auth/logout'),

    lawyerOnboarding: (dto: LawyerOnboardingDto) =>
      http.post('/auth/lawyer-onboarding', dto),
  } as const;
}
