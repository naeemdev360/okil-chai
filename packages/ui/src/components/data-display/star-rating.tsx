import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
  readonly rating: number;
  readonly count?: number | null;
  /**
   * `score` — single gold star + numeric rating + count. Default.
   * `row`   — 5 filled/empty stars + count.
   */
  readonly variant?: 'score' | 'row';
  /** `sm` = size-3.5 (default), `xs` = size-3 for compact contexts. */
  readonly size?: 'xs' | 'sm';
  readonly countClassName?: string;
  readonly className?: string;
}

export function StarRating({
  rating,
  count = null,
  variant = 'score',
  size = 'sm',
  countClassName,
  className,
}: StarRatingProps) {
  const starClass = size === 'xs' ? 'size-3' : 'size-3.5';
  const defaultCountClass = 'text-gray-400';

  if (variant === 'score') {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        <Star className={cn(starClass, 'fill-gold text-gold shrink-0')} aria-hidden />
        <span className="font-sans text-sm font-semibold text-navy">{rating}</span>
        {count !== null && (
          <span className={cn('font-sans text-xs', countClassName ?? defaultCountClass)}>
            ({count})
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            starClass,
            i <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200',
          )}
          aria-hidden
        />
      ))}
      {count !== null && (
        <span className={cn('font-sans text-sm ml-1', countClassName ?? defaultCountClass)}>
          ({count})
        </span>
      )}
    </span>
  );
}
