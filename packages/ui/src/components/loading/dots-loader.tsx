'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

const dotSizeMap = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
} as const;

const dotColorMap = {
  navy:  'bg-navy',
  gold:  'bg-gold',
  white: 'bg-white',
  gray:  'bg-gray-400',
} as const;

export interface DotsLoaderProps {
  readonly size?: keyof typeof dotSizeMap;
  readonly color?: keyof typeof dotColorMap;
  readonly className?: string;
  readonly label?: string;
}

export function DotsLoader({
  size = 'md',
  color = 'navy',
  className,
  label = 'Loading…',
}: DotsLoaderProps) {
  return (
    <div
      role="status"
      className={cn('flex items-center gap-1.5', className)}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn('block rounded-full', dotSizeMap[size], dotColorMap[color])}
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
