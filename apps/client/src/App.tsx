import { Navigate, Route, Routes } from 'react-router-dom';
import { NotificationsPage } from './routes/notifications/NotificationsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notifications" replace />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}
