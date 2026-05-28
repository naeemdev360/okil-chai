import { useClientAppointments, useConversations, useFavouriteLawyers } from '@repo/hooks';

interface NavCounts {
  readonly appointments: number;
  readonly saved: number;
  readonly messages: number;
}

export function useNavCounts(): NavCounts {
  const { data: appointmentsData } = useClientAppointments({ upcoming: true, limit: 1 });
  const { data: favouritesData } = useFavouriteLawyers({ limit: 1 });
  const { data: conversations } = useConversations();

  const appointments = appointmentsData?.meta?.total ?? 0;
  const saved = favouritesData?.meta?.total ?? 0;
  const messages = conversations
    ? conversations.reduce((sum, c) => sum + c.unreadCount, 0)
    : 0;

  return { appointments, saved, messages };
}
