import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './routes/dashboard';
import { brand } from './lib/brand';

export function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<div className="p-8 font-sans text-navy">{brand.name} Lawyer Portal — coming soon</div>} />
    </Routes>
  );
}
