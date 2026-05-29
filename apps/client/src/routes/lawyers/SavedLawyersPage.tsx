import { useDebounce, useFavouriteLawyers, useLocalStorage, useToggleFavourite } from '@repo/hooks';
import type { LawyerCardData } from '@repo/ui';
import { Button, EmptyState, Input, LawyerGridCard, LawyerListCard, Pagination, Reveal, RevealGroup, Skeleton } from '@repo/ui';
import type { LawyerPublicProfileResponse } from '@repo/shared';
import { Heart, LayoutGrid, LayoutList, Search, X } from 'lucide-react';
import { useState } from 'react';
import { appUrls } from '../../lib/app-urls';

const PAGE_SIZE = 10;

function toCardData(l: LawyerPublicProfileResponse): LawyerCardData {
  const rating = parseFloat(l.avgRating ?? '0');
  const reviews = l.totalReviews;

  let badge: LawyerCardData['badge'] = null;
  if (rating >= 4.8 && reviews >= 30) badge = 'topRated';
  else if (rating >= 4.5 && reviews >= 15) badge = 'pro';
  else if (reviews === 0) badge = 'new';

  return {
    id:                    l.id,
    initials:              `${l.firstName[0]}${l.lastName[0]}`.toUpperCase(),
    name:                  `${l.firstName} ${l.lastName}`,
    primarySpecialization: l.specializations.find((s) => s.isPrimary)?.name ?? l.specializations[0]?.name ?? '',
    rating,
    reviewCount:           reviews,
    pricePerHour:          parseFloat(l.pricePerHour ?? '0'),
    city:                  l.city ?? undefined,
    verified:              true,
    consultTypes:          l.consultationTypes,
    badge,
    bio:                   l.bio ?? undefined,
    availableToday:        l.isInstantBooking,
    photoUrl:              l.photoUrl,
    yearsOfExperience:     l.yearsOfExperience ?? null,
    languages:             l.languages,
  };
}

export function SavedLawyersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [view, setView] = useLocalStorage<'list' | 'grid'>('saved_lawyers_view', 'list');
  const debouncedSearch = useDebounce(searchInput, 400);
  const { data, isLoading } = useFavouriteLawyers({ page, limit: PAGE_SIZE, search: debouncedSearch || undefined });
  const { mutate: toggle, isPending, variables: pendingId } = useToggleFavourite();

  function handleSearchChange(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  const lawyers = data?.lawyers ?? [];
  const meta    = data?.meta;

  return (
    <RevealGroup className="min-w-0">
      <Reveal>
        <div className="flex items-start justify-between gap-4 mb-5 md:mb-6">
          <div>
            <h1 className="font-heading text-xl font-semibold text-navy sm:text-[24px] md:text-[26px] mb-1.5 leading-tight">
              Saved Lawyers
            </h1>
            <p className="text-sm text-gray-600 font-sans max-w-2xl">
              Lawyers you've bookmarked for future consultations.
            </p>
          </div>

          {/* View toggle */}
          {lawyers.length > 0 && (
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 bg-white shrink-0">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}
              >
                <LayoutList size={16} />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal>
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name…"
            className="pl-9 pr-9"
          />
          {searchInput && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </Reveal>

      <Reveal>
        {isLoading && (
          <ul className="flex list-none flex-col gap-4 p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <div className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 sm:gap-4">
                  <Skeleton className="size-14 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && lawyers.length === 0 && (
          debouncedSearch ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-14 text-center">
              <p className="font-heading text-[15px] font-semibold text-navy mb-1">No results found</p>
              <p className="font-sans text-sm text-gray-500 mb-5">
                No saved lawyers match &ldquo;{debouncedSearch}&rdquo;.
              </p>
              <Button variant="outline" size="sm" onClick={() => handleSearchChange('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <EmptyState
              icon={<Heart size={36} />}
              title="No saved lawyers yet"
              description="Browse lawyers and tap the heart icon to save them here for future consultations."
              primaryAction={{ label: 'Browse Lawyers', onClick: () => { window.location.href = appUrls.search; } }}
            />
          )
        )}

        {!isLoading && lawyers.length > 0 && view === 'list' && (
          <ul className="flex list-none flex-col gap-4 p-0">
            {lawyers.map((l) => (
              <li key={l.id}>
                <LawyerListCard
                  data={toCardData(l)}
                  currency="৳"
                  labels={{ viewProfile: 'View Profile', book: 'Book' }}
                  isFavourited
                  isFavouriteLoading={isPending && pendingId === l.id}
                  onToggleFavourite={() => toggle(l.id)}
                  onProfile={() => { window.location.href = appUrls.profile(l.id); }}
                  onBook={() => { window.location.href = appUrls.book(l.id); }}
                />
              </li>
            ))}
          </ul>
        )}

        {!isLoading && lawyers.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lawyers.map((l) => (
              <LawyerGridCard
                key={l.id}
                data={toCardData(l)}
                currency="৳"
                labels={{ viewProfile: 'View Profile', book: 'Book' }}
                isFavourited
                isFavouriteLoading={isPending && pendingId === l.id}
                onToggleFavourite={() => toggle(l.id)}
                onProfile={() => { window.location.href = appUrls.profile(l.id); }}
                onBook={() => { window.location.href = appUrls.book(l.id); }}
              />
            ))}
          </div>
        )}

        {!isLoading && meta && meta.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              itemsPerPage={PAGE_SIZE}
              itemLabel="lawyers"
              onPageChange={setPage}
            />
          </div>
        )}
      </Reveal>
    </RevealGroup>
  );
}
