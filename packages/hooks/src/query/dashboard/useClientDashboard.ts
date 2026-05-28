import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@repo/api-client';
import { useApiClient } from '../api-client-context';

export function useClientDashboard() {
  const api = useApiClient();
  return useQuery({
    queryKey: dashboardKeys.clientStats(),
    queryFn: () => api.dashboard.getClientStats(),
    staleTime: 60_000,
  });
}
