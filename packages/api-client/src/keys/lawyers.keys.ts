import type { LawyerAvailabilityParams, LawyerSearchParams } from '../types/lawyers.types';

export const lawyersKeys = {
  all: () => ['lawyers'] as const,

  lists: () => [...lawyersKeys.all(), 'list'] as const,
  list: (params: LawyerSearchParams) => [...lawyersKeys.lists(), params] as const,

  details: () => [...lawyersKeys.all(), 'detail'] as const,
  detail: (id: string) => [...lawyersKeys.details(), id] as const,

  availability: (id: string, params: LawyerAvailabilityParams) =>
    [...lawyersKeys.detail(id), 'availability', params] as const,

  dashboard: () => [...lawyersKeys.all(), 'dashboard'] as const,
} as const;
