import { cn, VerifiedCheckIcon } from '@okil-chai/ui';

interface LawyerAvatarProps {
  readonly initials: string;
  readonly verified: boolean;
  readonly size?: 'md' | 'lg';
  readonly className?: string;
}

function VerifiedBadge() {
  return (
    <span
      className="absolute -bottom-1 -right-1 size-5 bg-gold rounded-full flex items-center justify-center ring-2 ring-white"
      aria-label="Verified"
    >
      <VerifiedCheckIcon className="size-2.5" />
    </span>
  );
}

export function LawyerAvatar({ initials, verified, size = 'md', className }: LawyerAvatarProps) {
  return (
    <div className={cn('relative shrink-0', className)}>
      <div className={cn(
        'rounded-full bg-navy flex items-center justify-center',
        size === 'md' ? 'size-14' : 'size-20',
      )}>
        <span className={cn(
          'font-heading font-semibold text-white leading-none',
          size === 'md' ? 'text-lg' : 'text-2xl',
        )}>
          {initials}
        </span>
      </div>
      {verified && <VerifiedBadge />}
    </div>
  );
}
