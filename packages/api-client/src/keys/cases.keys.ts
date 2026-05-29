import type { ListCasesParams } from '../types/cases.types';

export const casesKeys = {
  all: () => ['cases'] as const,

  lists: () => [...casesKeys.all(), 'list'] as const,
  list: (params: ListCasesParams) => [...casesKeys.lists(), params] as const,

  details: () => [...casesKeys.all(), 'detail'] as const,
  detail: (id: string) => [...casesKeys.details(), id] as const,
} as const;
