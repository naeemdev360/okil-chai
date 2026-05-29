import type { ClientDashboardStats } from '@repo/api-client';
import { useClientDashboard } from '@repo/hooks';

/** A client with zero activity across every workspace area is treated as brand new. */
function hasNoActivity(stats: ClientDashboardStats): boolean {
  return (
    stats.upcomingCount === 0 &&
    stats.completedCount === 0 &&
    stats.savedLawyersCount === 0 &&
    stats.unreadMessagesCount === 0 &&
    parseFloat(stats.totalAmountSpent) === 0
  );
}

export interface NewClientState {
  readonly isNewClient: boolean;
  readonly isLoading: boolean;
}

/**
 * Single source of truth for the "new user" experience across the portal.
 * Drives the onboarding dashboard and the empty states on every page.
 */
export function useIsNewClient(): NewClientState {
  const { data: stats, isLoading } = useClientDashboard();
  return {
    isNewClient: !isLoading && !!stats && hasNoActivity(stats),
    isLoading: isLoading || !stats,
  };
}
