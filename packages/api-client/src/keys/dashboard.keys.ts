export const dashboardKeys = {
  all: () => ['dashboard'] as const,
  clientStats: () => [...dashboardKeys.all(), 'client'] as const,
} as const;
