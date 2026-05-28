import { AppointmentCardSkeleton } from '@repo/ui';

const SKELETON_COUNT = 3;

export function AppointmentsListSkeleton() {
  return (
    <div className="flex flex-col gap-3.5">
      <AppointmentCardSkeleton count={SKELETON_COUNT} />
    </div>
  );
}
