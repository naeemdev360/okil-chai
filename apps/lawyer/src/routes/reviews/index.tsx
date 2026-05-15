import { Pagination } from '@repo/ui';
import { useState } from 'react';
import { Reveal, RevealGroup } from '@repo/ui';
import { RatingDistributionCard } from '../../components/features/reviews/RatingDistributionCard';
import { ReviewCard } from '../../components/features/reviews/ReviewCard';
import { PageHeader } from '../../components/ui/PageHeader';
import type { MockData } from '../../types/lawyer.types';

const REVIEW_FILTERS = ['All', '5★', '4★', 'Needs reply', 'With photos'] as const;
const ITEMS_PER_PAGE = 3;

interface ReviewsPageProps {
  readonly data: MockData;
}

export function ReviewsPage({ data }: ReviewsPageProps) {
  const [activeFilter, setActiveFilter] = useState<typeof REVIEW_FILTERS[number]>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = activeFilter === 'All'
    ? data.reviews
    : data.reviews.filter((r) => {
        if (activeFilter === '5★') return r.rating === 5;
        if (activeFilter === '4★') return r.rating === 4;
        if (activeFilter === 'Needs reply') return !r.reply;
        return true;
      });

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedReviews = filteredReviews.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  function handleFilterChange(f: typeof REVIEW_FILTERS[number]) {
    setActiveFilter(f);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Reviews & ratings"
          subtitle={`${filteredReviews.length} verified reviews · 4.9 average rating`}
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-4 items-start">
        <RatingDistributionCard />

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-1.5">
            {REVIEW_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={[
                  'px-2.5 py-1 rounded-full font-sans text-[11px] font-medium border transition-colors',
                  f === activeFilter
                    ? 'bg-navy text-white border-navy'
                    : 'text-gray-600 border-gray-200 hover:border-navy/30',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Review list */}
          {pagedReviews.length === 0 ? (
            <div className="px-6 py-12 text-center font-sans text-[14px] text-gray-400">
              No reviews match this filter.
            </div>
          ) : (
            pagedReviews.map((r, i) => (
              <ReviewCard key={`${r.name}-${i}`} review={r} divider={i > 0} />
            ))
          )}

          {/* Pagination */}
          {filteredReviews.length > ITEMS_PER_PAGE && (
            <div className="px-5 border-t border-gray-100">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={filteredReviews.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}
