import { Avatar, StarRating } from '@repo/ui';
import type { Review } from '../../../types/lawyer.types';

interface ReviewCardProps {
  readonly review: Review;
  readonly divider?: boolean;
}

export function ReviewCard({ review: r, divider }: ReviewCardProps) {
  return (
    <div className={`px-6 py-5 ${divider ? 'border-t border-gray-100' : ''}`}>
      <div className="flex justify-between items-start mb-3 gap-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar initials={r.initials} size="md" />
          <div>
            <div className="font-sans text-[14px] font-semibold text-navy">{r.name}</div>
            <div className="font-sans text-[11px] text-gray-400">{r.area} · {r.date}</div>
          </div>
        </div>
        <StarRating rating={r.rating} size="xs" />
      </div>
      <p className="font-sans text-[14px] text-gray-800 leading-relaxed mb-3">"{r.text}"</p>
      {r.reply ? (
        <div className="p-3 bg-cream rounded-md border-l-[3px] border-l-gold">
          <div className="font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-1">Your reply</div>
          <p className="font-sans text-[13px] text-gray-800 leading-snug">{r.reply}</p>
        </div>
      ) : (
        <button className="px-3 py-1.5 border border-gray-200 rounded-md font-sans text-[12px] text-navy font-medium hover:bg-gray-50 transition-colors">
          Reply →
        </button>
      )}
    </div>
  );
}
