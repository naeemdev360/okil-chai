import { cn } from '@repo/ui';

interface MatchScoreBadgeProps {
  readonly score:  number;
  readonly isBest: boolean;
}

export function MatchScoreBadge({ score, isBest }: MatchScoreBadgeProps) {
  return (
    <span
      className={cn(
        'absolute -top-2 -right-3 font-heading text-[13px] font-bold px-2.5 py-1 rounded-full border-2 border-white',
        isBest ? 'bg-gold text-navy' : 'bg-navy text-white',
      )}
    >
      {score}%
    </span>
  );
}
