import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  readonly id: string;
  readonly label: string;
  /** Optional badge count — only rendered in the `light` variant. */
  readonly count?: number;
}

interface TabBarProps {
  readonly items: readonly TabItem[];
  readonly active: string;
  readonly onChange: (id: string) => void;
  /**
   * `light` — for white/cream surfaces: navy underline + count badge.
   * `dark`  — for navy surfaces: gold underline, white dimmed inactive text.
   */
  readonly variant?: 'light' | 'dark';
  readonly className?: string;
}

export function TabBar({
  items,
  active,
  onChange,
  variant = 'light',
  className,
}: TabBarProps) {
  return (
    <div className={cn('flex overflow-x-auto', className)}>
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex items-center gap-1.5 border-b-2 transition-all duration-150 whitespace-nowrap font-sans',
              variant === 'light'
                ? [
                    'px-3.5 py-3.5 text-[13px]',
                    isActive
                      ? 'border-b-gold text-navy font-semibold'
                      : 'border-b-transparent text-gray-600 font-normal hover:text-navy',
                  ]
                : [
                    'px-5 py-3.5 text-sm font-medium',
                    isActive
                      ? 'text-gold border-gold'
                      : 'text-white/60 border-transparent hover:text-white/80',
                  ],
            )}
          >
            {item.label}
            {variant === 'light' && item.count !== undefined && item.count > 0 && (
              <span
                className={cn(
                  'inline-flex items-center justify-center px-1.5 rounded-full text-[10px] font-bold',
                  isActive ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
