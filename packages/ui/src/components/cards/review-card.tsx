import * as React from 'react';
import { Badge } from '../ui/badge';
import { StarRating } from '../data-display/star-rating';

export interface ReviewData {
  readonly initials: string;
  readonly author: string;
  readonly rating: number;
  readonly date: string;
  readonly title: string;
  readonly body: string;
  readonly tags?: readonly string[];
  readonly reply?: string | null;
}

interface ReviewCardProps {
  readonly review: ReviewData;
  /** Name shown on the reply attribution line, e.g. the lawyer's name. */
  readonly replierName?: string;
}

export function ReviewCard({ review, replierName }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-navy-mid flex items-center justify-center shrink-0">
            <span className="font-heading text-sm font-semibold text-white">{review.initials}</span>
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-navy">{review.author}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating variant="row" rating={review.rating} />
              <span className="font-sans text-xs text-gray-400">· {review.date}</span>
            </div>
          </div>
        </div>
        <Badge variant="available" className="shrink-0">✓ Verified</Badge>
      </div>

      <h4 className="font-heading text-[15px] font-semibold text-navy mb-1.5">{review.title}</h4>
      <p className="font-sans text-sm text-gray-800 leading-relaxed mb-3">{review.body}</p>

      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {review.tags.map((tag) => (
            <span key={tag} className="font-sans text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
              {tag}
            </span>
          ))}
        </div>
      )}

      {review.reply && replierName && (
        <div className="mt-4 pl-4 border-l-[3px] border-gold bg-cream rounded-sm p-3">
          <p className="font-sans text-xs font-semibold text-navy mb-1">{replierName} replied</p>
          <p className="font-sans text-sm text-gray-800 leading-relaxed">{review.reply}</p>
        </div>
      )}
    </div>
  );
}
