import { Route, Routes } from 'react-router-dom';
import { brand } from './lib/brand';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 text-navy-900 font-bold text-gold text-3xl">{brand.name} Admin — coming soon</div>} />
    </Routes>
  );
}
