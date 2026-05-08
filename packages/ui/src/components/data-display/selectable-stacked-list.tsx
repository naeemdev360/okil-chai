import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export interface SelectableStackedListProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly children: React.ReactNode;
}

export function SelectableStackedList({ className, children, ...props }: SelectableStackedListProps) {
  return (
    <div className={cn('overflow-y-auto', className)} {...props}>
      {children}
    </div>
  );
}

export const stackedListItemVariants = cva(
  'flex w-full items-center gap-3 px-4 py-3.5 text-left border-b border-gray-100 border-l-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset',
  {
    variants: {
      state: {
        active: 'bg-gold-pale border-l-gold',
        inactive: 'border-l-transparent hover:bg-gray-50',
      },
    },
    defaultVariants: {
      state: 'inactive',
    },
  },
);

export interface SelectableStackedListItemProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'title'> {
  readonly isSelected?: boolean;
  readonly leading: React.ReactNode;
  readonly headline: React.ReactNode;
  readonly meta?: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly trailing?: React.ReactNode;
}

export const SelectableStackedListItem = React.forwardRef<HTMLButtonElement, SelectableStackedListItemProps>(
  (
    {
      isSelected = false,
      leading,
      headline,
      meta,
      subtitle,
      trailing,
      className,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-current={isSelected ? 'true' : undefined}
        className={cn(stackedListItemVariants({ state: isSelected ? 'active' : 'inactive' }), className)}
        {...props}
      >
        {leading}
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex min-w-0 items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[13px] font-semibold text-navy font-sans">{headline}</span>
            {meta != null && <span className="shrink-0 text-[11px] text-gray-400 font-sans">{meta}</span>}
          </div>
          {subtitle != null && <p className="truncate text-xs text-gray-600 font-sans">{subtitle}</p>}
        </div>
        {trailing}
      </button>
    );
  },
);

SelectableStackedListItem.displayName = 'SelectableStackedListItem';
