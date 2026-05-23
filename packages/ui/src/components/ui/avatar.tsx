'use client';

import { useState } from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  readonly initials: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Shows a presence dot when the subject is online. */
  readonly isOnline?: boolean;
  readonly className?: string;
  /** When provided, displays the photo; falls back to initials if the image fails to load. */
  readonly src?: string | null;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-14 h-14 text-base',
};

const ONLINE_DOT_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3',
  xl: 'size-3.5',
};

export function Avatar({ initials, size = 'md', isOnline = false, className, src }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = src && !imgFailed;

  return (
    <span className="relative inline-flex shrink-0">
      {showImage ? (
        <img
          src={src}
          alt={initials}
          onError={() => setImgFailed(true)}
          className={cn(
            'rounded-full object-cover',
            SIZE_CLASSES[size],
            className,
          )}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-navy font-semibold text-white select-none',
            SIZE_CLASSES[size],
            className,
          )}
        >
          {initials.slice(0, 2).toUpperCase()}
        </span>
      )}
      {isOnline ? (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white bg-success',
            ONLINE_DOT_CLASSES[size],
          )}
          aria-hidden
        />
      ) : null}
    </span>
  );
}
