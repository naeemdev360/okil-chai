import { SurfaceCard } from '@repo/ui';

interface SearchCardSkeletonProps {
  readonly variant: 'list' | 'grid';
}

function Bone({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

function GridSkeleton() {
  return (
    <SurfaceCard elevation="sm" padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 pt-6 pb-5 px-5 flex flex-col items-center gap-3">
        <Bone className="size-24 rounded-full" />
        <Bone className="w-36 h-4" />
        <Bone className="w-24 h-3" />
      </div>
      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <Bone className="w-20 h-3" />
          <Bone className="w-16 h-3" />
        </div>
        <Bone className="w-full h-3" />
        <Bone className="w-4/5 h-3" />
        <div className="flex gap-1.5">
          <Bone className="w-16 h-5 rounded-full" />
          <Bone className="w-14 h-5 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-3.5 border-t border-gray-100">
          <Bone className="w-14 h-5" />
          <Bone className="w-20 h-7 rounded-lg" />
        </div>
      </div>
    </SurfaceCard>
  );
}

function ListSkeleton() {
  return (
    <SurfaceCard elevation="sm" padding="none" className="flex gap-4 items-start p-5 md:p-6">
      <Bone className="size-14 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2.5">
        <Bone className="w-40 h-4" />
        <Bone className="w-24 h-3" />
        <Bone className="w-full h-3" />
        <Bone className="w-3/4 h-3" />
        <div className="flex justify-between items-center mt-1">
          <div className="flex gap-1.5">
            <Bone className="w-16 h-5 rounded-full" />
            <Bone className="w-14 h-5 rounded-full" />
          </div>
          <Bone className="w-24 h-8 rounded-xl" />
        </div>
      </div>
    </SurfaceCard>
  );
}

export function SearchCardSkeleton({ variant }: SearchCardSkeletonProps) {
  return variant === 'grid' ? <GridSkeleton /> : <ListSkeleton />;
}
