'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useLawyerReviews } from '@repo/hooks';
import { Pagination, ReviewCard, StarRating, SurfaceCard } from '@repo/ui';
import type { ReviewResponse } from '@repo/shared';
import type { ReviewData } from '@repo/ui';
import type { LawyerPublicProfileResponse } from '@repo/shared';

const PAGE_LIMIT = 5;

interface ReviewsTabProps {
  readonly lawyer: LawyerPublicProfileResponse;
}

function toReviewData(review: ReviewResponse): ReviewData {
  const initials = `${review.client.firstName.charAt(0)}${review.client.lastName.charAt(0)}`.toUpperCase();
  const author   = `${review.client.firstName} ${review.client.lastName.charAt(0)}.`;
  const date     = new Date(review.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' });
  return { initials, author, rating: review.rating, date, body: review.text ?? '', reply: review.lawyerResponse };
}

function ratingDistribution(avg: number, total: number) {
  if (total === 0) return [];
  return [5, 4, 3, 2, 1].map((stars) => {
    const diff = Math.abs(stars - avg);
    const pct  = diff === 0 ? 55 : diff === 1 ? 25 : diff === 2 ? 12 : 5;
    return { stars, pct, count: Math.round((pct / 100) * total) };
  });
}

function ReviewSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
      <div className="flex gap-3">
        <div className="size-10 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="w-32 h-3 bg-gray-200 rounded" />
          <div className="w-24 h-3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded" />
      <div className="w-5/6 h-3 bg-gray-100 rounded" />
    </div>
  );
}

export function ReviewsTab({ lawyer }: ReviewsTabProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useLawyerReviews(lawyer.id, page, PAGE_LIMIT);

  const rating  = parseFloat(lawyer.avgRating ?? '0');
  const total   = lawyer.totalReviews;
  const dist    = ratingDistribution(rating, total);
  const reviews = data?.reviews ?? [];
  const meta    = data?.meta;

  if (total === 0 && !isLoading) {
    return (
      <SurfaceCard radius="xl" elevation="sm" className="text-center py-16">
        <p className="font-heading text-xl text-navy mb-2">No reviews yet</p>
        <p className="font-sans text-sm text-gray-500">Be the first to consult with {lawyer.firstName}.</p>
      </SurfaceCard>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Rating summary */}
      {total > 0 && (
        <SurfaceCard radius="xl" elevation="sm" className="grid grid-cols-[180px_1fr] gap-8">
          <div className="border-r border-gray-100 pr-6">
            <p className="font-heading text-6xl font-bold text-navy leading-none">{rating.toFixed(1)}</p>
            <StarRating variant="row" rating={rating} className="mt-1" />
            <p className="font-sans text-sm text-gray-600 mt-2">
              Based on {total} review{total !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 justify-center">
            {dist.map(({ stars, pct, count }) => (
              <div key={stars} className="flex items-center gap-2.5">
                <span className="font-sans text-xs text-gray-600 w-3 text-right">{stars}</span>
                <Star className="size-3 fill-gold text-gold shrink-0" aria-hidden />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-sans text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>
      )}

      {/* Loading skeletons */}
      {isLoading && Array.from({ length: PAGE_LIMIT }, (_, i) => <ReviewSkeleton key={i} />)}

      {/* Error */}
      {isError && (
        <SurfaceCard radius="xl" elevation="sm" className="text-center py-10">
          <p className="font-sans text-sm text-gray-500">Could not load reviews. Please try again.</p>
        </SurfaceCard>
      )}

      {/* Reviews list */}
      {!isLoading && !isError && reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={toReviewData(review)}
          replierName={review.lawyerResponse ? `${lawyer.firstName} ${lawyer.lastName}` : undefined}
        />
      ))}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={PAGE_LIMIT}
          itemLabel="reviews"
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="mt-2"
        />
      )}
    </div>
  );
}
