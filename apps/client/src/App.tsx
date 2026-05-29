import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { ClientPortalLayout } from './components/layout/ClientPortalLayout';
import { AppointmentsPage } from './routes/appointments/AppointmentsPage';
import { CaseDetailPage } from './routes/cases/CaseDetailPage';
import { CasesPage } from './routes/cases/CasesPage';
import { CreateCasePage } from './routes/cases/CreateCasePage';
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
      <Route
        element={
          <RequireAuth>
            <ClientPortalLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"     element={<HomePage />} />
        <Route path="/appointments"  element={<AppointmentsPage />} />
        <Route path="/cases"         element={<CasesPage />} />
        <Route path="/cases/new"     element={<CreateCasePage />} />
        <Route path="/cases/:id"     element={<CaseDetailPage />} />
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
