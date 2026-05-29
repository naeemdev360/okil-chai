import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional leading icon, shown in a gold chip. Render at 16px to match the chip. */
  readonly icon?: React.ReactNode;
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  /** Optional right-aligned content (e.g. a button or badge). */
  readonly action?: React.ReactNode;
  /** Heading element to render the title as, for correct document outline. Defaults to h2. */
  readonly as?: 'h2' | 'h3' | 'h4';
}

/**
 * Card/section title row: an optional gold icon chip, a heading with optional
 * subtitle, and an optional right-aligned action slot. Shared across portals so
 * every panel header looks and spaces identically.
 */
const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ icon, title, subtitle, action, as = 'h2', className, ...props }, ref) => {
    const Heading = as;
    return (
      <div ref={ref} className={cn('mb-4 flex items-center gap-3', className)} {...props}>
        {icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold-pale text-gold">
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <Heading className="font-heading text-[16px] font-semibold leading-tight text-navy">
            {title}
          </Heading>
          {subtitle && <p className="text-[12px] text-gray-500 font-sans">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  },
);
SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
