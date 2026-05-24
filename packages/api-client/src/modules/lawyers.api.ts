import type { AvailabilityRuleResponse, LawyerProfileResponse, LawyerPublicProfileResponse } from '@repo/shared';
import type { Http } from '../core/http';
import type {
  AvailabilityRuleInput,
  LawyerAvailability,
  LawyerAvailabilityParams,
  LawyerDashboard,
  LawyerProfile,
  LawyerSearchParams,
} from '../types/lawyers.types';

export function createLawyersApi(http: Http) {
  return {
    search: (params: LawyerSearchParams) =>
      http.list<LawyerPublicProfileResponse>('/lawyers', { params }),

    getById: (id: string) =>
      http.get<LawyerProfile>(`/lawyers/${id}`),

    getAvailability: (id: string, params: LawyerAvailabilityParams) =>
      http.get<LawyerAvailability>(`/lawyers/${id}/availability`, { params }),

    getMyDashboard: () =>
      http.get<LawyerDashboard>('/lawyers/me/dashboard'),

    uploadAvatar: (formData: FormData) =>
      http.upload('/lawyers/me/avatar', formData),

    saveOnboardingData: (formData: FormData) =>
      http.upload('/lawyers/me/onboarding', formData),

    replaceAvailabilityRules: (rules: AvailabilityRuleInput[]) =>
      http.patch('/lawyers/me/availability', { rules }),

    getMyProfile: () =>
      http.get<LawyerProfileResponse>('/lawyers/me'),

    getMyAvailabilityRules: () =>
      http.get<AvailabilityRuleResponse[]>('/lawyers/me/availability'),

    deleteDocument: (documentId: string) =>
      http.remove(`/lawyers/me/documents/${documentId}`),
  } as const;
}
