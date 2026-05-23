import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium font-sans leading-none border',
  {
    variants: {
      variant: {
        default:   'bg-navy text-white border-navy',
        verified:  'bg-navy text-white border-navy',
        available: 'bg-success-bg text-success border-success/40',
        pending:   'bg-warning-bg text-warning border-warning/40',
        cancelled: 'bg-error-bg text-error border-error/40',
        pro:       'bg-gold-pale text-gold border-gold',
        topRated:  'bg-gold text-navy border-gold font-semibold',
        outline:   'bg-transparent text-gray-600 border-gray-200',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
