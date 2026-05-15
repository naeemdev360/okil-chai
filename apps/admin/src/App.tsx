import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { brand } from './lib/brand';

function AdminHome() {
  return (
    <div className="p-8 text-navy-900 font-bold text-gold text-3xl">
      {brand.name} Admin — coming soon
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminHome />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
