import { PageLoader, Reveal, RevealGroup } from '@repo/ui';
import { useIsNewClient } from '../../lib/use-is-new-client';
import { DocumentsWidget } from './components/DocumentsWidget';
import { MessagesWidget } from './components/MessagesWidget';
import { NewUserHome } from './components/NewUserHome';
import { NextConsultationCard } from './components/NextConsultationCard';
import { PremiumUpsellCard } from './components/PremiumUpsellCard';
import { RecentActivityFeed } from './components/RecentActivityFeed';
import { SavedLawyersWidget } from './components/SavedLawyersWidget';
import { UpcomingAppointmentsList } from './components/UpcomingAppointmentsList';
import { WelcomeBanner } from './components/WelcomeBanner';

function ActiveUserDashboard() {
  return (
    <RevealGroup className="min-w-0">
      <Reveal><WelcomeBanner /></Reveal>

      <Reveal>
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-6">
            <NextConsultationCard />
            <UpcomingAppointmentsList />
            <RecentActivityFeed />
          </div>

          {/* Right column */}
          <div className="flex min-w-0 flex-col gap-5">
            <MessagesWidget />
            <SavedLawyersWidget />
            <DocumentsWidget />
            <PremiumUpsellCard />
          </div>
        </div>
      </Reveal>
    </RevealGroup>
  );
}

export function HomePage() {
  const { isNewClient, isLoading } = useIsNewClient();

  // Wait for stats before branching so returning users never flash the onboarding screen.
  if (isLoading) return <PageLoader />;

  return isNewClient ? <NewUserHome /> : <ActiveUserDashboard />;
}
