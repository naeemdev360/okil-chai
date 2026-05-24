import { cn, VerifiedCheckIcon } from '@repo/ui';

interface LawyerAvatarProps {
  readonly initials: string;
  readonly verified: boolean;
  readonly photoUrl?: string | null;
  readonly size?: 'md' | 'lg' | 'xl';
  readonly className?: string;
}

const SIZE = {
  md: { avatar: 'size-16',   text: 'text-xl',   badge: 'size-5',   icon: 'size-2.5', offset: '-bottom-1 -right-1' },
  lg: { avatar: 'size-24',   text: 'text-3xl',  badge: 'size-6',   icon: 'size-3',   offset: '-bottom-1 -right-1' },
  xl: { avatar: 'size-[112px]', text: 'text-4xl', badge: 'size-8', icon: 'size-4',   offset: '-bottom-1 right-0'  },
} as const;

export function LawyerAvatar({ initials, verified, photoUrl, size = 'md', className }: LawyerAvatarProps) {
  const s = SIZE[size];
  return (
    <div className={cn('relative shrink-0', className)}>
      <div className={cn(
        'rounded-full overflow-hidden flex items-center justify-center',
        photoUrl
          ? 'ring-2 ring-white shadow-lg'
          : 'bg-navy shadow-md',
        s.avatar,
      )}>
        {photoUrl ? (
          <img src={photoUrl} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        ) : (
          <span className={cn('font-heading font-semibold text-white leading-none', s.text)}>
            {initials}
          </span>
        )}
      </div>
      {verified && (
        <span
          className={cn(
            'absolute bg-gold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm',
            s.badge,
            s.offset,
          )}
          aria-label="Verified"
        >
          <VerifiedCheckIcon className={s.icon} />
        </span>
      )}
    </div>
  );
}
