import * as React from 'react';
import { cn } from '../../utils/cn';

interface ToggleSwitchProps {
  readonly checked: boolean;
  readonly onChange: (value: boolean) => void;
  readonly label?: string;
  readonly disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, label, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative shrink-0 w-9 h-5 rounded-full transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        checked ? 'bg-navy' : 'bg-gray-200',
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-150',
          checked ? 'left-[calc(100%-17px)]' : 'left-[3px]',
        )}
      />
    </button>
  );
}
