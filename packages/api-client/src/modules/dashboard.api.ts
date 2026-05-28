import type { Http } from '../core/http';

export interface ClientDashboardStats {
  readonly upcomingCount: number;
  readonly completedCount: number;
  readonly savedLawyersCount: number;
  readonly unreadMessagesCount: number;
  readonly totalAmountSpent: string;
}

export function createDashboardApi(http: Http) {
  return {
    getClientStats: () =>
      http.get<ClientDashboardStats>('/dashboard/client'),
  } as const;
}
