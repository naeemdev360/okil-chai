import { Navigate, Route, Routes } from 'react-router-dom';
import { ClientPortalLayout } from './components/layout/ClientPortalLayout';
import { AppointmentsPage } from './routes/appointments/AppointmentsPage';
import { DocumentsPage } from './routes/documents/DocumentsPage';
import { HomePage } from './routes/home/HomePage';
import { SavedLawyersPage } from './routes/lawyers/SavedLawyersPage';
import { MessagesPage } from './routes/messages/MessagesPage';
import { NotificationsPage } from './routes/notifications/NotificationsPage';
import { PaymentsPage } from './routes/payments/PaymentsPage';
import { SettingsPage } from './routes/profile/SettingsPage';

export function App() {

  return (
    <Routes>
      <Route element={<ClientPortalLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"     element={<HomePage />} />
        <Route path="/appointments"  element={<AppointmentsPage />} />
        <Route path="/saved"         element={<SavedLawyersPage />} />
        <Route path="/messages"      element={<MessagesPage />} />
        <Route path="/documents"     element={<DocumentsPage />} />
        <Route path="/payments"      element={<PaymentsPage />} />
        <Route path="/settings"      element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}
