import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './button';

export interface EmptyStateAction {
  readonly label: string;
  readonly onClick: () => void;
}

export interface EmptyStateProps {
  /** Icon element rendered inside the gold medallion (e.g. a lucide icon). */
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly primaryAction?: EmptyStateAction;
  readonly secondaryAction?: EmptyStateAction;
  readonly className?: string;
}

/**
 * Consistent "nothing here yet" panel used across the client portal — a gold
 * medallion, a headline, supporting copy, and up to two calls to action.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-[60px]',
        className,
      )}
    >
      <div className="relative mx-auto mb-[22px] flex size-[88px] items-center justify-center rounded-full border border-gold/25 bg-gold-pale text-gold">
        {icon}
        <span className="absolute -right-1 -top-1 size-[18px] rounded-full bg-gold/20" />
        <span className="absolute -left-1.5 -bottom-0.5 size-3 rounded-full bg-gold/30" />
      </div>

      <h3 className="mb-2 font-heading text-[22px] font-semibold text-navy">{title}</h3>
      <p className="mx-auto mb-6 max-w-[380px] font-sans text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
          {primaryAction && (
            <Button variant="gold" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
              className="border border-gray-200"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
