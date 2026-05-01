import { Check } from 'lucide-react';
import { cn } from '@okil-chai/ui';

interface StepIconProps {
  readonly icon: React.ElementType;
  readonly done: boolean;
  readonly active: boolean;
}

export function StepIcon({ icon: Icon, done, active }: StepIconProps) {
  return (
    <div
      className={cn(
        'size-10 rounded-full border-2 flex items-center justify-center transition-all duration-200',
        done              && 'bg-gold border-gold',
        active && !done   && 'bg-navy border-navy',
        !done  && !active && 'bg-white border-gray-200',
      )}
    >
      {done
        ? <Check className="size-4 text-navy" strokeWidth={2.5} aria-hidden="true" />
        : <Icon className={cn('size-4', active ? 'text-white' : 'text-gray-400')} strokeWidth={1.6} aria-hidden="true" />
      }
    </div>
  );
}
