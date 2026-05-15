import { Star } from 'lucide-react';
import { ReviewCard, StarRating, SurfaceCard } from '@repo/ui';
import type { ReviewData } from '@repo/ui';
import type { Lawyer } from '../../../lib/search/mock-lawyers';

const MOCK_REVIEWS: readonly ReviewData[] = [
  {
    initials: 'RM', author: 'Rachel M.', rating: 5, date: 'March 2026',
    title: 'Helped me see my options clearly',
    body: 'Incredibly clear and patient. Walked me through my options without legalese and I left with a real plan.',
    tags: ['Knowledgeable', 'Clear communicator', 'Patient'],
    reply: 'Thank you Rachel — best of luck with the case!',
  },
  {
    initials: 'DK', author: 'David K.', rating: 5, date: 'February 2026',
    title: 'Top professional',
    body: 'Clear communication, prompt responses, and excellent results. Worth every penny.',
    tags: ['Professional', 'Got results'],
  },
  {
    initials: 'YT', author: 'Yvonne T.', rating: 4, date: 'January 2026',
    title: 'Very thorough',
    body: 'Very knowledgeable lawyer. Took time to explain everything in plain language.',
    tags: ['Knowledgeable', 'Patient'],
  },
];

const RATING_DIST = [
  { stars: 5, pct: 83, count: 118 },
  { stars: 4, pct: 13, count: 18  },
  { stars: 3, pct: 3,  count: 4   },
  { stars: 2, pct: 1,  count: 1   },
  { stars: 1, pct: 1,  count: 1   },
] as const;

interface ReviewsTabProps {
  readonly lawyer: Lawyer;
}

export function ReviewsTab({ lawyer }: ReviewsTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <SurfaceCard radius="xl" elevation="sm" className="grid grid-cols-[180px_1fr] gap-8">
        <div className="border-r border-gray-100 pr-6">
          <p className="font-heading text-6xl font-bold text-navy leading-none">{lawyer.rating}</p>
          <StarRating variant="row" rating={lawyer.rating} className="mt-1" />
          <p className="font-sans text-sm text-gray-600 mt-2">Based on {lawyer.reviewCount} reviews</p>
        </div>
        <div className="flex flex-col gap-1.5 justify-center">
          {RATING_DIST.map(({ stars, pct, count }) => (
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

      {MOCK_REVIEWS.map((review, i) => (
        <ReviewCard key={i} review={review} replierName={review.reply ? lawyer.name : undefined} />
      ))}
    </div>
  );
}
