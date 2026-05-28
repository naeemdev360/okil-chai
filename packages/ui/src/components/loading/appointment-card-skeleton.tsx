import * as React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '../../utils/cn';

export interface AppointmentCardSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function AppointmentCardSkeleton({ count = 1, className }: AppointmentCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4',
            className,
          )}
        >
          {/* Avatar */}
          <Skeleton rounded="full" className="size-12 sm:size-14 shrink-0" />

          {/* Middle: name + type badge row, then category · date */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Skeleton className="h-4 w-36" />
              <Skeleton rounded="sm" className="h-5 w-20" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>

          {/* Right: price + action buttons */}
          <div className="sm:text-right sm:w-auto shrink-0 space-y-2">
            <Skeleton className="h-4 w-12 sm:ml-auto" />
            <div className="flex gap-1.5 sm:justify-end">
              <Skeleton rounded="md" className="h-8 w-16" />
              <Skeleton rounded="md" className="h-8 w-14" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
