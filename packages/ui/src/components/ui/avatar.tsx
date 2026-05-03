'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  readonly initials: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-14 h-14 text-base',
};

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-navy text-white font-semibold select-none shrink-0',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
