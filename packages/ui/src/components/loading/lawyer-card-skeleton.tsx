import * as React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '../../utils/cn';

export interface LawyerCardSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function LawyerCardSkeleton({ count = 1, className }: LawyerCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('rounded-xl border border-gray-100 bg-white p-5 space-y-4', className)}
        >
          {/* Avatar + name block + availability badge */}
          <div className="flex items-center gap-3">
            <Skeleton rounded="full" className="size-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton rounded="full" className="h-5 w-16 shrink-0" />
          </div>

          {/* Star rating row */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Specialty tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton rounded="full" className="h-6 w-20" />
            <Skeleton rounded="full" className="h-6 w-16" />
            <Skeleton rounded="full" className="h-6 w-24" />
          </div>

          {/* Description lines */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* CTA button */}
          <Skeleton rounded="md" className="h-10 w-full" />
        </div>
      ))}
    </>
  );
}
