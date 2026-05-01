'use client';

import { useTransition } from 'react';
import { cn } from '../../utils/cn';

export interface LocaleOption {
  readonly code: string;
  readonly label: string;
}

export interface LanguageSwitcherProps {
  /** List of available locales to render as toggle options. */
  readonly locales: readonly LocaleOption[];
  /** The currently active locale code. */
  readonly activeLocale: string;
  /** Called when the user picks a different locale. */
  readonly onSwitch: (locale: string) => void;
  readonly className?: string;
}

export function LanguageSwitcher({
  locales,
  activeLocale,
  onSwitch,
  className,
}: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (code: string) => {
    if (code === activeLocale) return;
    startTransition(() => onSwitch(code));
  };

  return (
    <div
      role="group"
      aria-label="Select language"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-1',
        'transition-opacity duration-150',
        isPending && 'pointer-events-none opacity-60',
        className,
      )}
    >
      {locales.map(({ code, label }) => {
        const active = code === activeLocale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => handleSwitch(code)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-3.5 py-1 font-sans text-sm font-semibold',
              'transition-all duration-200 select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
              active
                ? 'bg-navy text-white shadow-sm focus-visible:ring-gold'
                : 'text-gray-500 hover:text-navy focus-visible:ring-navy',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
