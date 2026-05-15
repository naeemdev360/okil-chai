import { motion } from 'motion/react';
import type { ReactNode } from 'react';

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
} as const;

export interface RevealGroupProps {
  className?: string;
  children: ReactNode;
}

export function RevealGroup({ className, children }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export interface RevealProps {
  className?: string;
  children: ReactNode;
}

export function Reveal({ className, children }: RevealProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
