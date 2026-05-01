export const appointmentsKeys = {
  all: () => ['appointments'] as const,

  details: () => [...appointmentsKeys.all(), 'detail'] as const,
  detail: (id: string) => [...appointmentsKeys.details(), id] as const,
} as const;
