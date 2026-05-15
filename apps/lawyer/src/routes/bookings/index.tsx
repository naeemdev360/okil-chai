import { useState } from 'react';
import { Download, Plus, Search } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { BookingListItem } from '../../components/features/bookings/BookingListItem';
import { BookingDetailPanel } from '../../components/features/bookings/BookingDetailPanel';
import type { BookingStatus, MockData } from '../../types/lawyer.types';

type FilterKey = BookingStatus | 'all';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'pending',   label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Past' },
  { key: 'declined',  label: 'Declined' },
  { key: 'all',       label: 'All' },
];

interface BookingsPageProps {
  readonly data: MockData;
}

export function BookingsPage({ data }: BookingsPageProps) {
  const [filter, setFilter] = useState<FilterKey>('pending');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const counts: Record<FilterKey, number> = {
    pending:   data.bookings.filter(b => b.status === 'pending').length,
    confirmed: data.bookings.filter(b => b.status === 'confirmed').length,
    completed: data.bookings.filter(b => b.status === 'completed').length,
    declined:  data.bookings.filter(b => b.status === 'declined').length,
    all:       data.bookings.length,
  };

  const filtered = filter === 'all' ? data.bookings : data.bookings.filter(b => b.status === filter);
  const selected = filtered.find(b => b.id === selectedId) ?? filtered[0] ?? null;

  const handleFilterChange = (key: FilterKey) => {
    setFilter(key);
    setSelectedId(null);
  };

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Bookings"
          subtitle="Review requests, manage confirmed consultations"
          actions={
            <>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
                <Download size={14} strokeWidth={1.5} /> Export
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <Plus size={14} strokeWidth={1.5} /> New booking
              </button>
            </>
          }
        />
      </Reveal>

      {/* Filters + search bar */}
      <Reveal>
        <div className="bg-white px-4 py-3.5 rounded-xl border border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => handleFilterChange(f.key)}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[12px] font-medium transition-colors border',
                    active ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-200 hover:border-navy/30',
                  ].join(' ')}
                >
                  {f.label}
                  <span className={`px-1.5 rounded-full text-[11px] font-semibold ${active ? 'bg-white/18 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {counts[f.key]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
            <input
              placeholder="Search by client or topic"
              className="pl-8 pr-3 py-2 rounded-md border border-gray-200 font-sans text-[13px] outline-none focus:border-navy transition-colors w-52"
            />
          </div>
        </div>
      </Reveal>

      {/* Split: list + detail */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-4 items-start">
          {/* List */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState message="Nothing here." />
            ) : (
              <div className="max-h-[720px] overflow-y-auto">
                {filtered.map((b, i) => (
                  <BookingListItem
                    key={b.id}
                    booking={b}
                    isSelected={selected?.id === b.id}
                    onClick={() => setSelectedId(b.id)}
                    divider={i > 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          {selected ? (
            <BookingDetailPanel booking={selected} onStatusChange={data.act} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center font-sans text-[14px] text-gray-400">
              Select a booking to see details.
            </div>
          )}
        </div>
      </Reveal>
    </RevealGroup>
  );
}
