import { useMutation, useQueryClient } from '@tanstack/react-query';
import { casesKeys } from '@repo/api-client';
import type {
  AssignLawyerDto,
  CreateHearingDto,
  LinkAppointmentDto,
  ReleaseAssignmentDto,
  StageTransitionDto,
  UpdateHearingDto,
} from '@repo/api-client';
import { useApiClient } from '../api-client-context';

function invalidateCase(queryClient: ReturnType<typeof useQueryClient>, caseId: string) {
  queryClient.invalidateQueries({ queryKey: casesKeys.detail(caseId) });
  queryClient.invalidateQueries({ queryKey: casesKeys.lists() });
}

export function useAssignLawyer(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AssignLawyerDto) => api.cases.assignLawyer(caseId, dto),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useAcceptAssignment(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.cases.acceptAssignment(caseId),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useDeclineAssignment(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.cases.declineAssignment(caseId),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useReleaseAssignment(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ReleaseAssignmentDto) => api.cases.releaseAssignment(caseId, dto),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useTransitionStage(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: StageTransitionDto) => api.cases.transitionStage(caseId, dto),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useCloseCase(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.cases.close(caseId),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useCreateHearing(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateHearingDto) => api.cases.createHearing(caseId, dto),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useUpdateHearing(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hearingId, dto }: { hearingId: string; dto: UpdateHearingDto }) =>
      api.cases.updateHearing(caseId, hearingId, dto),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useDeleteHearing(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hearingId: string) => api.cases.deleteHearing(caseId, hearingId),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useUploadCaseDocument(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => api.cases.uploadDocument(caseId, file),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useDeleteCaseDocument(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => api.cases.deleteDocument(caseId, documentId),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useLinkAppointment(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: LinkAppointmentDto) => api.cases.linkAppointment(caseId, dto),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}

export function useUnlinkAppointment(caseId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: string) => api.cases.unlinkAppointment(caseId, appointmentId),
    onSuccess: () => invalidateCase(queryClient, caseId),
  });
}
