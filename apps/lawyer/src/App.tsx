import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { LawyerPortalLayout } from './components/layout/LawyerPortalLayout';
import { useMockData } from './lib/mock-data';
import { DashboardPage }     from './routes/dashboard';
import { BookingsPage }      from './routes/bookings';
import { ConsultPage }       from './routes/consult';
import { AvailabilityPage }  from './routes/availability';
import { MessagesPage }      from './routes/messages';
import { NotificationsPage } from './routes/notifications';
import { SettingsPage }      from './routes/settings';
import { ProfilePage }       from './routes/profile';
import { EarningsPage }      from './routes/earnings';
import { ReviewsPage }       from './routes/reviews';
import { DocumentsPage }     from './routes/documents';

function PortalRoutes() {
  const data = useMockData();

  return (
    <Routes>
      <Route
        element={
          <RequireAuth>
            <LawyerPortalLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"     element={<DashboardPage data={data} />} />
        <Route path="bookings"      element={<BookingsPage data={data} />} />
        <Route path="availability"  element={<AvailabilityPage data={data} />} />
        <Route path="messages"      element={<MessagesPage data={data} />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings"      element={<SettingsPage />} />
        <Route path="profile"       element={<ProfilePage />} />
        <Route path="earnings"      element={<EarningsPage data={data} />} />
        <Route path="reviews"       element={<ReviewsPage data={data} />} />
        <Route path="documents"     element={<DocumentsPage data={data} />} />
        <Route path="consult"       element={<ConsultPage data={data} />} />
        <Route path="listing"       element={<Navigate to="/profile" replace />} />
        <Route path="*"             element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return <PortalRoutes />;
}
