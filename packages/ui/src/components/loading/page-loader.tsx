'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface PageLoaderProps {
  readonly fullPage?: boolean;
  readonly message?: string;
  readonly className?: string;
}

export function PageLoader({ fullPage = false, message, className }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message ?? 'Loading…'}
      className={cn(
        'flex flex-col items-center justify-center gap-5',
        fullPage
          ? 'fixed inset-0 z-50 bg-cream/90 backdrop-blur-sm'
          : 'w-full min-h-48 py-16',
        className,
      )}
    >
      <AnimatedScaleMark />

      {message && (
        <motion.p
          className="text-sm font-sans text-gray-600 tracking-wide"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>
      )}

      <span className="sr-only">{message ?? 'Loading…'}</span>
    </div>
  );
}

function AnimatedScaleMark() {
  return (
    <div className="relative size-16 flex items-center justify-center">
      {/* Navy circle background with subtle pulse */}
      <motion.div
        className="absolute inset-0 rounded-full bg-navy"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dashed gold ring orbiting slowly */}
      <motion.svg
        viewBox="0 0 64 64"
        fill="none"
        className="absolute inset-0 size-full text-gold"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeDasharray="7 5"
        />
      </motion.svg>

      {/* Balance scale icon, gently tilting */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative size-8 text-gold"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
        aria-hidden="true"
      >
        {/* Base */}
        <line x1="8"  y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pole */}
        <line x1="12" y1="21" x2="12" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Beam */}
        <line x1="3"  y1="8"  x2="21" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Center knob */}
        <circle cx="12" cy="8" r="1" fill="currentColor" />
        {/* Left chain */}
        <line x1="5"  y1="8"  x2="5"  y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Left pan */}
        <path d="M 2 13 Q 5 16.5 8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Right chain */}
        <line x1="19" y1="8"  x2="19" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right pan */}
        <path d="M 16 13 Q 19 16.5 22 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </motion.svg>
    </div>
  );
}
