import { useCancelAppointment, useClientAppointments } from '@repo/hooks';
import { EmptyState, Pagination } from '@repo/ui';
import { CalendarDays } from 'lucide-react';
import { appUrls } from '../../../lib/app-urls';
import type { FilterKey } from '../AppointmentsPage';
import { PAGE_SIZE } from '../utils/appointments.utils';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentsListSkeleton } from './AppointmentsListSkeleton';

const EMPTY_CONTENT: Record<FilterKey, { title: string; description: string }> = {
  upcoming: {
    title:       'No upcoming consultations',
    description: "Book your first consultation with a verified lawyer. We'll match you with specialists in your area.",
  },
  past: {
    title:       'No past consultations yet',
    description: "Once you've had a consultation, it'll show up here so you can leave reviews or rebook.",
  },
  all: {
    title:       'No appointments yet',
    description: 'Find a verified lawyer and book your first consultation to get started.',
  },
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
    const { title, description } = EMPTY_CONTENT[filter];
    return (
      <EmptyState
        icon={<CalendarDays size={36} />}
        title={title}
        description={description}
        primaryAction={{ label: 'Find a Lawyer', onClick: () => { window.location.href = appUrls.search; } }}
      />
    );
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
