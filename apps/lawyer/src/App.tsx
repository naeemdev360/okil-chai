import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './routes/dashboard';

export function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<div className="p-8 font-sans text-navy">OkilChai Lawyer Portal — coming soon</div>} />
    </Routes>
  );
}
