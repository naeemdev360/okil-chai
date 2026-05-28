import { useCancelAppointment, useClientAppointments } from '@repo/hooks';
import { Pagination } from '@repo/ui';
import type { FilterKey } from '../AppointmentsPage';
import { PAGE_SIZE } from '../utils/appointments.utils';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentsListSkeleton } from './AppointmentsListSkeleton';

const EMPTY_MESSAGES: Record<FilterKey, string> = {
  upcoming: 'No upcoming appointments.',
  past:     'No past appointments.',
  all:      'No appointments yet.',
};

interface AppointmentsListProps {
  readonly filter: FilterKey;
  readonly page: number;
  readonly onPageChange: (page: number) => void;
}

export function AppointmentsList({ filter, page, onPageChange }: AppointmentsListProps) {
  const params = {
    upcoming: filter === 'upcoming' ? true : undefined,
    past:     filter === 'past'     ? true : undefined,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError } = useClientAppointments(params);
  const { mutate: cancel, isPending: isCancelling } = useCancelAppointment();

  const appointments = data?.appointments ?? [];
  const meta = data?.meta;

  if (isLoading) return <AppointmentsListSkeleton />;

  if (isError) {
    return (
      <p className="text-sm text-red-500 font-sans">
        Failed to load appointments. Please try again.
      </p>
    );
  }

  if (appointments.length === 0) {
    return <p className="text-sm text-gray-500 font-sans">{EMPTY_MESSAGES[filter]}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-3.5">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            isUpcomingTab={filter === 'upcoming'}
            onCancel={(id) => cancel(id)}
            isCancelling={isCancelling}
          />
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <Pagination
          className="mt-4"
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={PAGE_SIZE}
          itemLabel="appointments"
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
