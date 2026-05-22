'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

const roundedMap = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
} as const;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly rounded?: keyof typeof roundedMap;
}

export function Skeleton({ className, rounded = 'md', ...props }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn('relative overflow-hidden bg-gray-100', roundedMap[rounded], className)}
      {...props}
    >
      {/* Shimmer overlay that sweeps left to right */}
      <motion.span
        className="absolute inset-0 block"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245,244,241,0.9) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
        aria-hidden="true"
      />
    </div>
  );
}
