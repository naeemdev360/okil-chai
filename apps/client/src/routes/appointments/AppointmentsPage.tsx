import { Button, Reveal, RevealGroup } from '@repo/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { appUrls } from '../../lib/app-urls';
import { AppointmentsList } from './components/AppointmentsList';

export type FilterKey = 'upcoming' | 'past' | 'all';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past',     label: 'Past' },
  { key: 'all',      label: 'All' },
];

export function AppointmentsPage() {
  const [filter, setFilter] = useState<FilterKey>('upcoming');
  const [page, setPage] = useState(1);

  function handleFilterChange(key: FilterKey) {
    setFilter(key);
    setPage(1);
  }

  return (
    <RevealGroup>
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
          <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px]">
            My Appointments
          </h1>
          <Button
            variant="gold"
            onClick={() => { window.location.href = appUrls.search; }}
            className="w-full shrink-0 sm:w-auto"
          >
            <Plus size={14} /> Book New
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`px-4 py-2 rounded-full text-[13px] font-sans transition-all border-[1.5px] ${
                filter === f.key
                  ? 'bg-navy text-white border-navy font-semibold'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <AppointmentsList
          filter={filter}
          page={page}
          onPageChange={setPage}
        />
      </Reveal>
    </RevealGroup>
  );
}
