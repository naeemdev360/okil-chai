'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealOnScrollProps {
  readonly children: ReactNode;
  readonly delay?: number;
}

const REVEAL_OFFSET = 40;
const REVEAL_DURATION = 0.5;
const REVEAL_EASING: [number, number, number, number] = [0, 0, 0.2, 1];

export function RevealOnScroll({ children, delay = 0 }: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: REVEAL_OFFSET }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASING, delay }}
    >
      {children}
    </motion.div>
  );
}
