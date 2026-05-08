import * as React from 'react';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly icon?: React.ReactNode;
  readonly className?: string;
}

export function StatCard({ label, value, delta, icon, className }: StatCardProps) {
  return (
    <div className={cn('isolate min-w-0 rounded-lg border p-3.5 sm:p-4', className)}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1 text-[11px] font-sans font-semibold uppercase leading-snug tracking-[0.06em] opacity-45">
          {label}
        </span>
        {icon ? (
          <span className="shrink-0 opacity-80 [&_svg]:block" aria-hidden>
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mb-1 font-heading text-xl font-bold leading-tight tabular-nums sm:text-[26px] sm:leading-none">
        {value}
      </div>
      {delta ? <div className="text-[11px] font-sans leading-snug opacity-40">{delta}</div> : null}
    </div>
  );
}
