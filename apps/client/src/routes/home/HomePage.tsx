import { DocumentsWidget } from './components/DocumentsWidget';
import { MessagesWidget } from './components/MessagesWidget';
import { NextConsultationCard } from './components/NextConsultationCard';
import { PremiumUpsellCard } from './components/PremiumUpsellCard';
import { RecentActivityFeed } from './components/RecentActivityFeed';
import { SavedLawyersWidget } from './components/SavedLawyersWidget';
import { UpcomingAppointmentsList } from './components/UpcomingAppointmentsList';
import { WelcomeBanner } from './components/WelcomeBanner';

export function HomePage() {
  return (
    <div className="min-w-0">
      <WelcomeBanner />

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
    </div>
  );
}
