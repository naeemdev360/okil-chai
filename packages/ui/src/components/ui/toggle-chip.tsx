import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ToggleChipProps {
  readonly active: boolean;
  readonly rounded?: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}

export function ToggleChip({ active, rounded = false, onClick, children }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm font-sans font-medium border-[1.5px] transition-all duration-150',
        rounded ? 'rounded-full' : 'rounded-md',
        active
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400',
      )}
    >
      {active && <Check className="inline size-3 mr-1 -mt-0.5" strokeWidth={2.5} aria-hidden="true" />}
      {children}
    </button>
  );
}
