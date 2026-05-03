'use client';

import { cn, SurfaceCard } from '@okil-chai/ui';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import { MOCK_LAWYERS } from '../../lib/search/mock-lawyers';
import { LawyerCard } from './LawyerCard';
import { LawyerCardGrid } from './LawyerCardGrid';

type FilterKey = 'all' | 'availableToday' | 'video' | 'under150' | 'topRated';
type ViewMode  = 'list' | 'grid';

const FILTER_KEYS: readonly FilterKey[] = [
  'all', 'availableToday', 'video', 'under150', 'topRated',
];

function filterLawyers(
  lawyers: readonly Lawyer[],
  query: string,
  filter: FilterKey,
): Lawyer[] {
  let results = [...lawyers];

  if (query.trim()) {
    const lower = query.toLowerCase();
    results = results.filter(
      (l) =>
        l.name.toLowerCase().includes(lower) ||
        l.specialization.toLowerCase().includes(lower) ||
        l.city.toLowerCase().includes(lower),
    );
  }

  switch (filter) {
    case 'availableToday': return results.filter((l) => l.availableToday);
    case 'video':          return results.filter((l) => l.consultTypes.includes('video'));
    case 'under150':       return results.filter((l) => l.pricePerHour < 150);
    case 'topRated':       return results.filter((l) => l.badge === 'topRated');
    default:               return results;
  }
}

// ─── View toggle ──────────────────────────────────────────────────────────────

interface ViewToggleProps {
  readonly view: ViewMode;
  readonly onChange: (v: ViewMode) => void;
}

function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <SurfaceCard
      radius="lg"
      elevation="sm"
      padding="none"
      className="inline-flex items-center gap-0.5 border-gray-200 p-1"
      role="group"
      aria-label="View mode"
    >
      <button
        onClick={() => onChange('list')}
        aria-label="List view"
        aria-pressed={view === 'list'}
        className={cn(
          'flex items-center justify-center size-7 rounded-md transition-all duration-150',
          view === 'list'
            ? 'bg-navy text-white shadow-sm'
            : 'text-gray-400 hover:text-navy hover:bg-gray-50',
        )}
      >
        <LayoutList className="size-3.5" aria-hidden />
      </button>
      <button
        onClick={() => onChange('grid')}
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
        className={cn(
          'flex items-center justify-center size-7 rounded-md transition-all duration-150',
          view === 'grid'
            ? 'bg-navy text-white shadow-sm'
            : 'text-gray-400 hover:text-navy hover:bg-gray-50',
        )}
      >
        <LayoutGrid className="size-3.5" aria-hidden />
      </button>
    </SurfaceCard>
  );
}

// ─── Results list / grid ──────────────────────────────────────────────────────

function ResultsList({ lawyers }: { lawyers: Lawyer[] }) {
  return (
    <ul className="flex flex-col gap-4 list-none p-0">
      {lawyers.map((lawyer) => (
        <li key={lawyer.id}>
          <LawyerCard lawyer={lawyer} />
        </li>
      ))}
    </ul>
  );
}

function ResultsGrid({ lawyers }: { lawyers: Lawyer[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {lawyers.map((lawyer) => (
        <LawyerCardGrid key={lawyer.id} lawyer={lawyer} />
      ))}
    </div>
  );
}

// ─── Main pane ────────────────────────────────────────────────────────────────

export function SearchResultsPane() {
  const searchParams  = useSearchParams();
  const query         = searchParams.get('q') ?? '';
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [view, setView]                 = useState<ViewMode>('grid');
  const t = useTranslations('search');

  const filtered = useMemo(
    () => filterLawyers(MOCK_LAWYERS, query, activeFilter),
    [query, activeFilter],
  );

  return (
    <section className="bg-cream min-h-[calc(100vh-200px)]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Toolbar: count, filters, view toggle */}
        <div className="mb-6">
          <p className="font-sans text-sm text-gray-600 mb-3">
            {t('showing')}{' '}
            <strong className="text-navy">{filtered.length} {t('lawyers')}</strong>
            {query && (
              <> {t('for')} &ldquo;<span className="text-navy">{query}</span>&rdquo;</>
            )}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap pb-0.5">
              {FILTER_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={cn(
                    'font-sans text-sm rounded-full px-4 py-1.5 border transition-all duration-150',
                    activeFilter === key
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy',
                  )}
                >
                  {t(`filters.${key}`)}
                </button>
              ))}
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-2xl text-navy mb-2">{t('noResults.title')}</p>
            <p className="font-sans text-gray-600">{t('noResults.subtitle')}</p>
          </div>
        ) : view === 'list' ? (
          <ResultsList lawyers={filtered} />
        ) : (
          <ResultsGrid lawyers={filtered} />
        )}
      </div>
    </section>
  );
}
