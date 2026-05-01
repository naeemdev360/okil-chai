import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './routes/dashboard';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 font-sans text-navy">OkilChai Lawyer Portal — coming soon</div>} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
