import type { CaseDocumentResponse, CaseSummary } from '@repo/shared';
import type { Http } from '../core/http';
import type {
  AssignLawyerDto,
  CaseDetailView,
  CreateCaseDto,
  CreateHearingDto,
  LinkAppointmentDto,
  ListCasesParams,
  ReleaseAssignmentDto,
  StageTransitionDto,
  UpdateCaseDto,
  UpdateHearingDto,
} from '../types/cases.types';

export function createCasesApi(http: Http) {
  return {
    list: (params?: ListCasesParams) =>
      http.list<CaseSummary>('/cases', { params }),

    create: (dto: CreateCaseDto) =>
      http.post<CaseDetailView>('/cases', dto),

    getById: (id: string) =>
      http.get<CaseDetailView>(`/cases/${id}`),

    update: (id: string, dto: UpdateCaseDto) =>
      http.patch<CaseSummary>(`/cases/${id}`, dto),

    assignLawyer: (id: string, dto: AssignLawyerDto) =>
      http.post<void>(`/cases/${id}/assign-lawyer`, dto),

    acceptAssignment: (id: string) =>
      http.post<void>(`/cases/${id}/accept-assignment`),

    declineAssignment: (id: string) =>
      http.post<void>(`/cases/${id}/decline-assignment`),

    releaseAssignment: (id: string, dto: ReleaseAssignmentDto) =>
      http.post<void>(`/cases/${id}/release-assignment`, dto),

    transitionStage: (id: string, dto: StageTransitionDto) =>
      http.post<void>(`/cases/${id}/stage-transitions`, dto),

    close: (id: string) =>
      http.post<void>(`/cases/${id}/close`),

    createHearing: (id: string, dto: CreateHearingDto) =>
      http.post<void>(`/cases/${id}/hearings`, dto),

    updateHearing: (id: string, hearingId: string, dto: UpdateHearingDto) =>
      http.patch<void>(`/cases/${id}/hearings/${hearingId}`, dto),

    deleteHearing: (id: string, hearingId: string) =>
      http.remove<void>(`/cases/${id}/hearings/${hearingId}`),

    uploadDocument: (id: string, file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return http.upload<CaseDocumentResponse>(`/cases/${id}/documents`, fd);
    },

    deleteDocument: (id: string, documentId: string) =>
      http.remove<void>(`/cases/${id}/documents/${documentId}`),

    linkAppointment: (id: string, dto: LinkAppointmentDto) =>
      http.post<void>(`/cases/${id}/appointments`, dto),

    unlinkAppointment: (id: string, appointmentId: string) =>
      http.remove<void>(`/cases/${id}/appointments/${appointmentId}`),
  } as const;
}
