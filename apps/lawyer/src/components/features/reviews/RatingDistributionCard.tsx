import { StarRating } from '@repo/ui';

const DISTRIBUTION = [
  { stars: 5, count: 118, pct: 83 },
  { stars: 4, count: 18,  pct: 13 },
  { stars: 3, count: 4,   pct: 3  },
  { stars: 2, count: 1,   pct: 1  },
  { stars: 1, count: 1,   pct: 1  },
] as const;

export function RatingDistributionCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
      <div className="font-heading text-[64px] font-bold text-navy leading-none">4.9</div>
      <div className="flex justify-center my-2">
        <StarRating rating={5} variant="row" size="sm" />
      </div>
      <div className="font-sans text-[13px] text-gray-600 mb-5">Based on 142 reviews</div>

      <div className="border-t border-gray-100 pt-5">
        {DISTRIBUTION.map(d => (
          <div key={d.stars} className="flex items-center gap-2.5 mb-2">
            <span className="font-sans text-[12px] text-gray-600 w-6 text-right">{d.stars}★</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div style={{ width: `${d.pct}%` }} className="h-full bg-gold" />
            </div>
            <span className="font-sans text-[11px] text-gray-400 w-7 text-right">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
