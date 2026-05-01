import type { Http } from '../core/http';
import type {
  VerificationActionDto,
  VerificationRequest,
} from '../types/admin.types';

export function createAdminApi(http: Http) {
  return {
    getVerifications: () =>
      http.list<VerificationRequest>('/admin/verifications'),

    approveVerification: (id: string, dto?: VerificationActionDto) =>
      http.post(`/admin/verifications/${id}/approve`, dto),

    rejectVerification: (id: string, dto: VerificationActionDto) =>
      http.post(`/admin/verifications/${id}/reject`, dto),
  } as const;
}
