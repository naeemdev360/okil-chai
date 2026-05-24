'use client';

import { cn, Pagination, SurfaceCard } from '@repo/ui';
import { useLawyerSearch } from '@repo/hooks';
import { ConsultationType } from '@repo/shared';
import type { LawyerSearchParams } from '@repo/api-client';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toLawyerDisplay } from '../../lib/search/lawyer-display';
import type { LawyerDisplay } from '../../lib/search/lawyer-display';
import { LawyerCard } from './LawyerCard';
import { LawyerCardGrid } from './LawyerCardGrid';
import { SearchCardSkeleton } from './SearchCardSkeleton';

type FilterKey = 'all' | 'availableToday' | 'video' | 'under150' | 'topRated';
type ViewMode  = 'list' | 'grid';

const FILTER_KEYS: readonly FilterKey[] = [
  'all', 'availableToday', 'video', 'under150', 'topRated',
];
const PAGE_LIMIT = 12;
const SKELETON_COUNT = 6;

const FILTER_PARAMS: Readonly<Record<FilterKey, Partial<LawyerSearchParams>>> = {
  all:            {},
  availableToday: { isInstantBooking: true },
  video:          { consultationType: ConsultationType.VIDEO },
  under150:       { maxPrice: 150 },
  topRated:       { rating: 4 },
};

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

// ─── Loading skeletons ────────────────────────────────────────────────────────

function LoadingSkeleton({ view }: { view: ViewMode }) {
  const items = Array.from({ length: SKELETON_COUNT }, (_, i) => i);
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((i) => <SearchCardSkeleton key={i} variant="grid" />)}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-4 list-none p-0">
      {items.map((i) => <li key={i}><SearchCardSkeleton variant="list" /></li>)}
    </ul>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function ResultsList({ lawyers }: { readonly lawyers: LawyerDisplay[] }) {
  return (
    <ul className="flex flex-col gap-4 list-none p-0" aria-live="polite" aria-atomic="false">
      {lawyers.map((lawyer) => (
        <li key={lawyer.id}><LawyerCard lawyer={lawyer} /></li>
      ))}
    </ul>
  );
}

function ResultsGrid({ lawyers }: { readonly lawyers: LawyerDisplay[] }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      aria-live="polite"
      aria-atomic="false"
    >
      {lawyers.map((lawyer) => (
        <LawyerCardGrid key={lawyer.id} lawyer={lawyer} />
      ))}
    </div>
  );
}

// ─── Main pane ────────────────────────────────────────────────────────────────

export function SearchResultsPane() {
  const urlParams      = useSearchParams();
  const query          = urlParams.get('q') ?? '';
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [view,         setView]         = useState<ViewMode>('grid');
  const [page,         setPage]         = useState(1);
  const t = useTranslations('search');

  useEffect(() => { setPage(1); }, [query, activeFilter]);

  const apiParams = useMemo<LawyerSearchParams>(
    () => ({
      q: query.trim() || undefined,
      ...FILTER_PARAMS[activeFilter],
      page,
      limit: PAGE_LIMIT,
    }),
    [query, activeFilter, page],
  );

  const { data, isLoading, isError, refetch, isFetching } = useLawyerSearch(apiParams);

  const lawyers = useMemo<LawyerDisplay[]>(
    () => (data?.lawyers ?? []).map(toLawyerDisplay),
    [data?.lawyers],
  );

  const meta = data?.meta;

  return (
    <section className="bg-cream min-h-[calc(100vh-200px)]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Toolbar: count, filters, view toggle */}
        <div className="mb-6">
          <p
            className="font-sans text-sm text-gray-600 mb-3"
            aria-live="polite"
            aria-atomic="true"
          >
            {isLoading ? (
              <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
            ) : !isError && (
              <>
                {t('showing')}{' '}
                <strong className="text-navy">{meta?.total ?? lawyers.length} {t('lawyers')}</strong>
                {query && (
                  <> {t('for')} &ldquo;<span className="text-navy">{query}</span>&rdquo;</>
                )}
              </>
            )}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap pb-0.5">
              {FILTER_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={cn(
                    'font-sans text-sm rounded-full px-4 py-1.5 border transition-all duration-150 whitespace-nowrap',
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

        {/* Loading */}
        {isLoading && <LoadingSkeleton view={view} />}

        {/* Error */}
        {isError && !isLoading && (
          <div className="text-center py-20">
            <p className="font-heading text-2xl text-navy mb-2">{t('error.title')}</p>
            <p className="font-sans text-gray-600 mb-6">{t('error.subtitle')}</p>
            <button
              onClick={() => void refetch()}
              className="font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(138deg, #E8C96A 0%, #C8A84B 100%)',
                color: '#0F1F3D',
              }}
            >
              {t('retry')}
            </button>
          </div>
        )}

        {/* No results */}
        {!isLoading && !isError && lawyers.length === 0 && (
          <div className="text-center py-20">
            <p className="font-heading text-2xl text-navy mb-2">{t('noResults.title')}</p>
            <p className="font-sans text-gray-600">{t('noResults.subtitle')}</p>
          </div>
        )}

        {/* Results — fade on background re-fetches */}
        {!isLoading && !isError && lawyers.length > 0 && (
          <div className={cn('transition-opacity duration-200', isFetching && 'opacity-60')}>
            {view === 'list'
              ? <ResultsList lawyers={lawyers} />
              : <ResultsGrid lawyers={lawyers} />
            }
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemsPerPage={PAGE_LIMIT}
            itemLabel={t('lawyers')}
            onPageChange={setPage}
            className="mt-8"
          />
        )}

      </div>
    </section>
  );
}
